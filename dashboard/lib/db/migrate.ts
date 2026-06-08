/**
 * migrate.ts — สร้าง tables ทั้งหมดใน MSSQL
 * รันด้วย: npm run db:migrate
 */
import { getPool, sql } from './connection.js'

const migrations: { name: string; sql: string }[] = [

  // ─── Users (Auth) ──────────────────────────────────────
  {
    name: 'create_users',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id            NVARCHAR(50)  PRIMARY KEY DEFAULT NEWID(),
        email         NVARCHAR(200) NOT NULL UNIQUE,
        name          NVARCHAR(100) NOT NULL,
        password_hash NVARCHAR(200) NOT NULL,
        role          NVARCHAR(20)  NOT NULL DEFAULT 'viewer'
                      CHECK (role IN ('admin','editor','viewer')),
        member_id     NVARCHAR(50),
        is_active     BIT           NOT NULL DEFAULT 1,
        last_login    DATETIME2,
        created_at    DATETIME2     NOT NULL DEFAULT GETDATE(),
        updated_at    DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Members ───────────────────────────────────────────
  {
    name: 'create_members',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='members' AND xtype='U')
      CREATE TABLE members (
        id          NVARCHAR(50)  PRIMARY KEY,
        name        NVARCHAR(100) NOT NULL,
        role        NVARCHAR(100) NOT NULL,
        avatar      NVARCHAR(10)  NOT NULL,
        color       NVARCHAR(100) NOT NULL DEFAULT 'bg-gray-100 text-gray-700',
        status      NVARCHAR(20)  NOT NULL DEFAULT 'idle'
                    CHECK (status IN ('active','idle','meeting','offline')),
        current_task NVARCHAR(255),
        client_id   NVARCHAR(50),
        created_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
        updated_at  DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Clients ───────────────────────────────────────────
  {
    name: 'create_clients',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='clients' AND xtype='U')
      CREATE TABLE clients (
        id          NVARCHAR(50)  PRIMARY KEY,
        name        NVARCHAR(200) NOT NULL,
        business    NVARCHAR(100) NOT NULL DEFAULT 'software-house',
        phase       NVARCHAR(50)  NOT NULL DEFAULT 'presales'
                    CHECK (phase IN ('presales','planning','delivery','handover','support')),
        progress    INT           NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
        start_date  DATE,
        due_date    DATE,
        budget      DECIMAL(15,2) NOT NULL DEFAULT 0,
        spent       DECIMAL(15,2) NOT NULL DEFAULT 0,
        lead_id     NVARCHAR(50)  REFERENCES members(id),
        notes       NVARCHAR(MAX),
        created_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
        updated_at  DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Client Members (many-to-many) ─────────────────────
  {
    name: 'create_client_members',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='client_members' AND xtype='U')
      CREATE TABLE client_members (
        client_id   NVARCHAR(50) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        member_id   NVARCHAR(50) NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        role        NVARCHAR(100),
        joined_at   DATETIME2    NOT NULL DEFAULT GETDATE(),
        PRIMARY KEY (client_id, member_id)
      )
    `
  },

  // ─── Tasks ─────────────────────────────────────────────
  {
    name: 'create_tasks',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tasks' AND xtype='U')
      CREATE TABLE tasks (
        id          NVARCHAR(50)  PRIMARY KEY DEFAULT NEWID(),
        title       NVARCHAR(500) NOT NULL,
        description NVARCHAR(MAX),
        client_id   NVARCHAR(50)  REFERENCES clients(id),
        assignee_id NVARCHAR(50)  REFERENCES members(id),
        status      NVARCHAR(20)  NOT NULL DEFAULT 'todo'
                    CHECK (status IN ('todo','in-progress','done','blocked')),
        priority    NVARCHAR(20)  NOT NULL DEFAULT 'medium'
                    CHECK (priority IN ('high','medium','low')),
        phase       NVARCHAR(50),
        due_date    DATE,
        tags        NVARCHAR(500),
        created_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
        updated_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
        completed_at DATETIME2
      )
    `
  },

  // ─── Issues ────────────────────────────────────────────
  {
    name: 'create_issues',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='issues' AND xtype='U')
      CREATE TABLE issues (
        id          NVARCHAR(50)  PRIMARY KEY DEFAULT NEWID(),
        title       NVARCHAR(500) NOT NULL,
        description NVARCHAR(MAX),
        client_id   NVARCHAR(50)  REFERENCES clients(id),
        reporter    NVARCHAR(100) NOT NULL,
        assignee_id NVARCHAR(50)  REFERENCES members(id),
        priority    NVARCHAR(5)   NOT NULL DEFAULT 'P3'
                    CHECK (priority IN ('P1','P2','P3')),
        status      NVARCHAR(20)  NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open','in-progress','resolved','closed')),
        tags        NVARCHAR(500),
        created_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
        updated_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
        resolved_at DATETIME2
      )
    `
  },

  // ─── Activity Log ──────────────────────────────────────
  {
    name: 'create_activity_log',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='activity_log' AND xtype='U')
      CREATE TABLE activity_log (
        id          INT           PRIMARY KEY IDENTITY(1,1),
        member_id   NVARCHAR(50)  REFERENCES members(id),
        action      NVARCHAR(100) NOT NULL,
        detail      NVARCHAR(500) NOT NULL,
        client_id   NVARCHAR(50)  REFERENCES clients(id),
        type        NVARCHAR(20)  NOT NULL DEFAULT 'task'
                    CHECK (type IN ('code','issue','task','deploy','design','other')),
        created_at  DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Goals ─────────────────────────────────────────────
  {
    name: 'create_goals',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='goals' AND xtype='U')
      CREATE TABLE goals (
        id          NVARCHAR(50)  PRIMARY KEY DEFAULT NEWID(),
        title       NVARCHAR(300) NOT NULL,
        description NVARCHAR(MAX),
        progress    INT           NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
        due_date    DATE,
        status      NVARCHAR(20)  NOT NULL DEFAULT 'on-track'
                    CHECK (status IN ('on-track','at-risk','behind','done')),
        owner_id    NVARCHAR(50)  REFERENCES members(id),
        created_at  DATETIME2     NOT NULL DEFAULT GETDATE(),
        updated_at  DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Routines ──────────────────────────────────────────
  {
    name: 'create_routines',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='routines' AND xtype='U')
      CREATE TABLE routines (
        id              NVARCHAR(50)  PRIMARY KEY DEFAULT NEWID(),
        name            NVARCHAR(200) NOT NULL,
        schedule        NVARCHAR(200) NOT NULL,
        prompt_template NVARCHAR(MAX) NOT NULL,
        last_run        NVARCHAR(100),
        next_run        NVARCHAR(100),
        is_active       BIT           NOT NULL DEFAULT 1,
        created_at      DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Routine Members (many-to-many) ────────────────────
  {
    name: 'create_routine_members',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='routine_members' AND xtype='U')
      CREATE TABLE routine_members (
        routine_id  NVARCHAR(50) NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
        member_id   NVARCHAR(50) NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        PRIMARY KEY (routine_id, member_id)
      )
    `
  },

  // ─── Monthly Costs ─────────────────────────────────────
  {
    name: 'create_monthly_costs',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='monthly_costs' AND xtype='U')
      CREATE TABLE monthly_costs (
        id              INT           PRIMARY KEY IDENTITY(1,1),
        year_month      NVARCHAR(7)   NOT NULL UNIQUE,
        display_label   NVARCHAR(20)  NOT NULL,
        budget          DECIMAL(15,2) NOT NULL DEFAULT 0,
        actual          DECIMAL(15,2) NOT NULL DEFAULT 0,
        claude_tokens   INT           NOT NULL DEFAULT 0,
        created_at      DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Agent Usage Log ───────────────────────────────────
  {
    name: 'create_agent_usage',
    sql: `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='agent_usage' AND xtype='U')
      CREATE TABLE agent_usage (
        id          INT           PRIMARY KEY IDENTITY(1,1),
        agent_name  NVARCHAR(100) NOT NULL,
        member_id   NVARCHAR(50)  REFERENCES members(id),
        client_id   NVARCHAR(50)  REFERENCES clients(id),
        used_at     DATETIME2     NOT NULL DEFAULT GETDATE()
      )
    `
  },

  // ─── Indexes ───────────────────────────────────────────
  {
    name: 'create_indexes',
    sql: `
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_tasks_client_status')
        CREATE INDEX idx_tasks_client_status ON tasks(client_id, status);
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_tasks_assignee')
        CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_issues_client_priority')
        CREATE INDEX idx_issues_client_priority ON issues(client_id, priority);
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_activity_log_date')
        CREATE INDEX idx_activity_log_date ON activity_log(created_at DESC);
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='idx_agent_usage_name')
        CREATE INDEX idx_agent_usage_name ON agent_usage(agent_name);
    `
  },
]

async function migrate() {
  console.log('🚀 Starting migration...')
  const pool = await getPool()

  for (const m of migrations) {
    try {
      await pool.request().query(m.sql)
      console.log(`  ✅ ${m.name}`)
    } catch (err: any) {
      console.error(`  ❌ ${m.name}:`, err.message)
      process.exit(1)
    }
  }

  console.log('\n✅ Migration complete!')
  console.log('   Next: npm run db:seed')
  process.exit(0)
}

migrate().catch(console.error)
