# ASSBBS Web

ASSBBS Web 是一个基于 Bun + Hono 的轻量级论坛系统。

## 技术栈

- **RT**: [Bun](https://bun.sh/) - 一个快速的 JavaScript 运行时和工具链
- **JS**: [Hono](https://hono.dev/) - 轻量级、快速的 Web 框架
- **DB**: [LibSQL](https://turso.tech/libsql) - 分布式 SQLite 数据库
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - 类型安全的 ORM
- **CSS**: [daisyUI](https://daisyui.com/) - 实用优先的 Tailwind CSS 框架
- **其它**:
  - `dompurify`: HTML 内容净化
  - `xregexp`: 增强的正则表达式库

## 项目结构

```
assbbs-web/
├── app/                # 主应用代码目录
│   ├── app.ts         # 应用入口文件
│   ├── base.ts        # 数据库模型定义
│   ├── core.ts        # 基础配置和工具函数
│   ├── iAuth.ts       # 认证相关
│   ├── iConf.ts       # 配置相关
│   ├── iData.ts       # 用户数据处理
│   ├── pData.ts       # 帖子数据处理
│   ├── pEdit.ts       # 帖子编辑
│   ├── pList.ts       # 帖子列表
│   ├── tData.ts       # 主题数据处理
│   └── tList.ts       # 主题列表
├── bare/              # 静态资源目录
├── const/             # 常量和配置文件
├── migrations/        # 数据库迁移文件
└── init.ts     # 数据库初始化脚本

```

## 数据库结构

系统使用 SQLite 数据库，通过 Drizzle ORM 进行管理，主要包含以下表：

- **conf**: 系统配置表

  - `key`: 配置键（主键）
  - `value`: 配置值（JSON 格式）

- **user**: 用户表

  - `uid`: 用户 ID（主键）
  - `gid`: 用户组 ID
  - `mail`: 邮箱（唯一）
  - `name`: 用户名（唯一）
  - `hash`: 密码哈希
  - `salt`: 密码盐值
  - `threads`: 发帖数
  - `posts`: 回帖数
  - `credits`: 积分
  - `golds`: 金币
  - `time`: 注册时间

- **thread**: 主题表

  - `tid`: 主题 ID（主键）
  - `uid`: 发帖用户 ID
  - `subject`: 主题标题
  - `access`: 访问权限
  - `is_top`: 是否置顶
  - `time`: 创建时间
  - `last_time`: 最后回复时间
  - `last_uid`: 最后回复用户 ID
  - `posts`: 回复数量

- **post**: 帖子表
  - `pid`: 帖子 ID（主键）
  - `tid`: 主题 ID
  - `uid`: 发帖用户 ID
  - `content`: 帖子内容
  - `access`: 访问权限
  - `time`: 发帖时间
  - `quote_pid`: 引用帖子 ID

## 安全说明

### 密码处理

- 前端使用 MD5 对密码进行加密后传输
- 后端存储 MD5(MD5(password)+salt)
- 登录时比对 hash 值进行验证

### 配置处理

- 所有配置值统一使用 JSON 格式存储
- 配置读取时会尝试 JSON.parse
- 如果解析失败则使用原始值
- 包含 secret_key 用于 JWT 签名

## 开发环境设置

1. 安装依赖:

```bash
bun install
```

2. 初始化数据库:

```bash
# 生成数据库迁移文件
bun run db:generate

# 应用数据库变更
bun run db:push

# 初始化基础数据
bun run db:init
```

3. 启动开发服务器:

```bash
bun run dev
```

服务器将在 http://localhost:3000 启动。

## 默认账号

系统初始化后会创建以下账号：

- 管理员账号

  - 邮箱：admin@example.com
  - 密码：admin123
  - 权限：管理员组（gid=99）
  - 2025.03.02 目前管理员组 gid 还是 1 这是沿用 xiuno

- 测试账号
  - 邮箱：test@example.com
  - 密码：test123
  - 权限：普通用户组（gid=0）

## 系统配置

系统的主要配置存储在 conf 表中，包括：

- `site_name`: 站点名称
- `site_description`: 站点描述
- `register_enable`: 是否开放注册
- `post_interval`: 发帖间隔（秒）
- `credits_initial`: 新用户初始积分
- `credits_login`: 登录奖励积分
- `credits_post`: 发帖奖励积分
- `theme`: 主题设置（JSON 格式）
- `secret_key`: JWT 签名密钥
- `friend_link`: 友情链接列表（JSON 格式）

## 部署说明

### 生产环境部署

```bash
# 安装依赖
bun install

# 应用数据库迁移
bun run db:push

# 数据库初始化
bun run db:init

# 启动服务器
bun run dev
```

### 数据库备份

建议定期备份 `app.db` 文件以保护数据安全。

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
