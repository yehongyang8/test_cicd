#!/bin/bash
# 前端 + 后端架构与代码规范校验脚本
# 根据项目规范文档自动检查目录结构、命名规范、编码风格等

set -e

ERRORS=0
WARNINGS=0

error() {
  echo "❌ ERROR: $1"
  ERRORS=$((ERRORS + 1))
}

warn() {
  echo "⚠️  WARN: $1"
  WARNINGS=$((WARNINGS + 1))
}

pass() {
  echo "✅ PASS: $1"
}

echo "=========================================="
echo "  前端 + 后端架构与代码规范校验"
echo "=========================================="
echo ""

# ==========================================
# 1. 核心目录结构校验
# ==========================================
echo "📁 [1/7] 目录结构校验"
echo "------------------------------------------"

REQUIRED_DIRS=(
  "src/components"
  "src/pages"
  "src/hooks"
  "src/stores"
  "src/utils"
  "src/routes"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    pass "目录存在: $dir"
  else
    error "缺少必要目录: $dir"
  fi
done

# 检查核心文件
REQUIRED_FILES=(
  "src/App.tsx:应用入口组件"
  "src/main.tsx:应用启动入口"
  "src/vite-env.d.ts:Vite 类型声明"
)

for entry in "${REQUIRED_FILES[@]}"; do
  file="${entry%%:*}"
  desc="${entry##*:}"
  if [ -f "$file" ]; then
    pass "文件存在: $file ($desc)"
  else
    error "缺少必要文件: $file ($desc)"
  fi
done

echo ""

# ==========================================
# 2. 页面模块结构校验 (PascalCase 目录)
# ==========================================
echo "📁 [2/7] 页面模块命名校验 (PascalCase)"
echo "------------------------------------------"

if [ -d "src/pages" ]; then
  for dir in src/pages/*/; do
    [ -d "$dir" ] || continue
    dirname=$(basename "$dir")
    # PascalCase: 首字母大写，不含连字符和下划线
    if [[ "$dirname" =~ ^[A-Z][a-zA-Z0-9]*$ ]]; then
      pass "页面目录命名正确: $dirname"
    else
      error "页面目录应使用 PascalCase: $dirname"
    fi

    # 检查页面入口文件
    if [ -f "${dir}index.tsx" ]; then
      pass "页面入口存在: ${dir}index.tsx"
    else
      error "页面缺少入口文件: ${dir}index.tsx"
    fi
  done
fi

echo ""

# ==========================================
# 3. 全局组件结构校验 (PascalCase 目录)
# ==========================================
echo "🧩 [3/7] 全局组件命名校验 (PascalCase)"
echo "------------------------------------------"

if [ -d "src/components" ]; then
  for item in src/components/*/; do
    [ -d "$item" ] || continue
    dirname=$(basename "$item")
    # 跳过通用小写目录 (ui, loading 等工具目录)
    if [[ "$dirname" =~ ^[a-z] ]]; then
      warn "组件目录建议使用 PascalCase: $dirname (当前为小写开头)"
    else
      if [[ "$dirname" =~ ^[A-Z][a-zA-Z0-9]*$ ]]; then
        pass "组件目录命名正确: $dirname"
      else
        error "组件目录应使用 PascalCase: $dirname"
      fi
    fi
  done
fi

echo ""

# ==========================================
# 4. Hook 命名校验 (useXxx.ts)
# ==========================================
echo "🎣 [4/7] Hook 命名校验 (useXxx)"
echo "------------------------------------------"

find src -name "*.ts" -o -name "*.tsx" | while read -r file; do
  filename=$(basename "$file")
  dirpath=$(dirname "$file")
  dirbasename=$(basename "$dirpath")

  # 只检查 hooks 目录下的文件，或以 use 开头的文件
  if [[ "$dirbasename" == "hooks" ]] && [[ "$filename" != "index.ts" ]] && [[ "$filename" != "index.tsx" ]]; then
    # hooks 目录下的文件应以 use 开头
    name="${filename%.*}"
    if [[ "$name" =~ ^use[A-Z] ]]; then
      pass "Hook 命名正确: $file"
    else
      error "hooks 目录下文件应以 useXxx 命名: $file"
    fi
  fi
done

echo ""

# ==========================================
# 5. 文件行数校验 (不超过 500 行)
# ==========================================
echo "📏 [5/7] 文件行数校验 (上限 500 行)"
echo "------------------------------------------"

MAX_LINES=500
OVER_LIMIT=0

find src -name "*.ts" -o -name "*.tsx" | while read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt "$MAX_LINES" ]; then
    warn "文件超过 ${MAX_LINES} 行: $file (${lines} 行)"
  fi
done

echo ""

# ==========================================
# 6. 导入规范校验
# ==========================================
echo "📦 [6/7] 导入规范校验"
echo "------------------------------------------"

# 检查是否有直接使用 fetch 的地方（应使用 httpClient）
FETCH_USAGE=$(grep -rn "await fetch(" src/ --include="*.ts" --include="*.tsx" 2>/dev/null || true)
if [ -n "$FETCH_USAGE" ]; then
  error "不应直接使用 fetch，请使用项目封装的 httpClient"
  echo "$FETCH_USAGE" | head -5
else
  pass "未发现直接使用 fetch"
fi

# 检查是否有 console.log 残留
CONSOLE_USAGE=$(grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null || true)
if [ -n "$CONSOLE_USAGE" ]; then
  CONSOLE_COUNT=$(echo "$CONSOLE_USAGE" | wc -l | tr -d ' ')
  warn "发现 ${CONSOLE_COUNT} 处 console.log，建议在生产代码中移除"
fi

echo ""

# ==========================================
# 7. TypeScript 命名规范校验
# ==========================================
echo "📝 [7/7] TypeScript 命名规范校验"
echo "------------------------------------------"

# 检查常量是否使用 UPPER_SNAKE_CASE（只检查 constants.ts 文件）
find src -name "constants.ts" | while read -r file; do
  # 检查 export const 但不是函数的声明
  NON_UPPER=$(grep -n "export const [a-z]" "$file" 2>/dev/null | grep -v "export const use" | grep -v "= (" | grep -v "= function" || true)
  if [ -n "$NON_UPPER" ]; then
    warn "constants.ts 中的常量建议使用 UPPER_SNAKE_CASE: $file"
    echo "$NON_UPPER" | head -3
  fi
done

# 检查组件是否使用 PascalCase 导出
find src/components -name "index.tsx" 2>/dev/null | while read -r file; do
  LOWER_EXPORT=$(grep -n "export function [a-z]" "$file" 2>/dev/null || true)
  if [ -n "$LOWER_EXPORT" ]; then
    error "组件应使用 PascalCase 命名导出: $file"
    echo "$LOWER_EXPORT" | head -3
  fi
done

echo ""
echo "=========================================="
echo "  后端架构规范校验"
echo "=========================================="
echo ""

# ==========================================
# 8. 后端核心目录结构校验
# ==========================================
echo "📁 [8/14] 后端目录结构校验"
echo "------------------------------------------"

BACKEND_DIR="backend"

if [ -d "$BACKEND_DIR" ]; then
  pass "后端目录存在: $BACKEND_DIR"

  BE_REQUIRED_DIRS=(
    "$BACKEND_DIR/controllers:控制器层"
    "$BACKEND_DIR/services:业务逻辑层"
    "$BACKEND_DIR/db:数据访问层"
    "$BACKEND_DIR/db/schema:数据库表结构定义"
    "$BACKEND_DIR/lib:工具与库"
    "$BACKEND_DIR/middleware:中间件"
  )

  for entry in "${BE_REQUIRED_DIRS[@]}"; do
    dir="${entry%%:*}"
    desc="${entry##*:}"
    if [ -d "$dir" ]; then
      pass "目录存在: $dir ($desc)"
    else
      error "缺少必要后端目录: $dir ($desc)"
    fi
  done
else
  warn "未发现后端目录 $BACKEND_DIR，跳过后端校验"
fi

echo ""

# ==========================================
# 9. Controller 文件命名校验 ([module].controller.ts)
# ==========================================
echo "🎮 [9/14] Controller 命名校验 ([module].controller.ts)"
echo "------------------------------------------"

if [ -d "$BACKEND_DIR/controllers" ]; then
  CTRL_FILES=$(find "$BACKEND_DIR/controllers" -maxdepth 1 -name "*.ts" -not -name "schemas.ts" -not -name "index.ts" 2>/dev/null || true)
  if [ -n "$CTRL_FILES" ]; then
    echo "$CTRL_FILES" | while read -r file; do
      filename=$(basename "$file")
      if [[ "$filename" =~ ^[a-z][a-zA-Z0-9-]*\.controller\.ts$ ]]; then
        pass "Controller 命名正确: $filename"
      else
        error "Controller 文件应命名为 [module].controller.ts: $filename"
      fi
    done
  else
    warn "controllers 目录下未发现 controller 文件"
  fi

  # 检查 schemas.ts 是否存在
  if [ -f "$BACKEND_DIR/controllers/schemas.ts" ]; then
    pass "Schema 定义文件存在: controllers/schemas.ts"
  else
    warn "建议在 controllers/ 下创建 schemas.ts 定义请求/响应 Schema"
  fi
fi

echo ""

# ==========================================
# 10. Service 文件命名校验 ([module].service.ts)
# ==========================================
echo "⚙️  [10/14] Service 命名校验 ([module].service.ts)"
echo "------------------------------------------"

if [ -d "$BACKEND_DIR/services" ]; then
  SVC_FILES=$(find "$BACKEND_DIR/services" -maxdepth 1 -name "*.ts" -not -name "index.ts" 2>/dev/null || true)
  if [ -n "$SVC_FILES" ]; then
    echo "$SVC_FILES" | while read -r file; do
      filename=$(basename "$file")
      if [[ "$filename" =~ ^[a-z][a-zA-Z0-9-]*\.service\.ts$ ]]; then
        pass "Service 命名正确: $filename"
      else
        error "Service 文件应命名为 [module].service.ts: $filename"
      fi
    done
  else
    warn "services 目录下未发现 service 文件"
  fi
fi

echo ""

# ==========================================
# 11. Controller 禁止直接操作数据库
# ==========================================
echo "🚫 [11/14] Controller 层禁止直接操作数据库"
echo "------------------------------------------"

if [ -d "$BACKEND_DIR/controllers" ]; then
  # 检查 controller 中是否直接导入 db 层
  DB_IN_CTRL=$(grep -rn "from.*['\"].*db" "$BACKEND_DIR/controllers/" --include="*.ts" 2>/dev/null | grep -v "schemas" || true)
  if [ -n "$DB_IN_CTRL" ]; then
    error "Controller 中禁止直接导入数据库模块，应通过 Service 层操作"
    echo "$DB_IN_CTRL" | head -5
  else
    pass "Controller 未直接导入数据库模块"
  fi

  # 检查 controller 中是否有 SQL 操作关键词
  SQL_IN_CTRL=$(grep -rn "\.select\(\)\|\.insert(\|\.update(\|\.delete(\|drizzle\|\.execute(" "$BACKEND_DIR/controllers/" --include="*.ts" 2>/dev/null || true)
  if [ -n "$SQL_IN_CTRL" ]; then
    error "Controller 中禁止直接执行数据库操作"
    echo "$SQL_IN_CTRL" | head -5
  else
    pass "Controller 未直接执行数据库操作"
  fi
fi

echo ""

# ==========================================
# 12. HTTP 接口规范校验
# ==========================================
echo "🌐 [12/14] HTTP 接口规范校验"
echo "------------------------------------------"

if [ -d "$BACKEND_DIR/controllers" ]; then
  # 禁止使用路径参数 /:id 模式
  PATH_PARAMS=$(grep -rn "/:.*['\"]" "$BACKEND_DIR/controllers/" --include="*.ts" 2>/dev/null | grep -v "node_modules" || true)
  if [ -n "$PATH_PARAMS" ]; then
    error "禁止使用路径参数传递 ID (如 /user/:id)，应使用 Query 参数"
    echo "$PATH_PARAMS" | head -5
  else
    pass "未发现路径参数模式"
  fi

  # 禁止使用 PUT / DELETE 方法
  PUT_DELETE=$(grep -rn "method:\s*['\"]put['\"\|method:\s*['\"]delete['\"]" "$BACKEND_DIR/controllers/" --include="*.ts" 2>/dev/null || true)
  if [ -z "$PUT_DELETE" ]; then
    PUT_DELETE=$(grep -rn "\.put(\|\.delete(" "$BACKEND_DIR/controllers/" --include="*.ts" 2>/dev/null || true)
  fi
  if [ -n "$PUT_DELETE" ]; then
    error "禁止使用 PUT / DELETE 方法，应统一使用 GET 和 POST"
    echo "$PUT_DELETE" | head -5
  else
    pass "未发现 PUT/DELETE 方法"
  fi
fi

echo ""

# ==========================================
# 13. 数据库 Schema 审计字段校验
# ==========================================
echo "🗄️  [13/14] 数据库 Schema 审计字段校验"
echo "------------------------------------------"

if [ -d "$BACKEND_DIR/db/schema" ]; then
  SCHEMA_FILES=$(find "$BACKEND_DIR/db/schema" -name "*.ts" -not -name "index.ts" -not -name "table_schema.ts" 2>/dev/null || true)
  if [ -n "$SCHEMA_FILES" ]; then
    AUDIT_FIELDS=("createBy" "createTime" "updateBy" "updateTime" "deleteTime")
    echo "$SCHEMA_FILES" | while read -r file; do
      filename=$(basename "$file")
      MISSING_FIELDS=""
      for field in "${AUDIT_FIELDS[@]}"; do
        if ! grep -q "$field" "$file" 2>/dev/null; then
          MISSING_FIELDS="$MISSING_FIELDS $field"
        fi
      done
      if [ -n "$MISSING_FIELDS" ]; then
        error "Schema $filename 缺少审计字段:$MISSING_FIELDS"
      else
        pass "Schema $filename 包含所有审计字段"
      fi
    done
  else
    warn "db/schema 目录下未发现表结构定义文件"
  fi
else
  if [ -d "$BACKEND_DIR" ]; then
    error "缺少 db/schema 目录"
  fi
fi

echo ""

# ==========================================
# 14. 后端编码规范校验
# ==========================================
echo "📝 [14/14] 后端编码规范校验"
echo "------------------------------------------"

if [ -d "$BACKEND_DIR" ]; then
  # 检查 Service 中是否有魔法值（硬编码状态数字）
  MAGIC_NUMBERS=$(grep -rn "status\s*===\s*[0-9]\|status\s*==\s*[0-9]\|status:\s*[0-9]" "$BACKEND_DIR/services/" --include="*.ts" 2>/dev/null || true)
  if [ -n "$MAGIC_NUMBERS" ]; then
    warn "Service 层发现疑似魔法值，建议抽取为常量或枚举"
    echo "$MAGIC_NUMBERS" | head -5
  else
    pass "Service 层未发现明显魔法值"
  fi

  # 检查后端文件行数
  find "$BACKEND_DIR" -name "*.ts" | while read -r file; do
    lines=$(wc -l < "$file")
    if [ "$lines" -gt "$MAX_LINES" ]; then
      warn "后端文件超过 ${MAX_LINES} 行: $file (${lines} 行)"
    fi
  done

  # 检查 console.log 残留
  BE_CONSOLE=$(grep -rn "console\.log" "$BACKEND_DIR/" --include="*.ts" 2>/dev/null || true)
  if [ -n "$BE_CONSOLE" ]; then
    BE_CONSOLE_COUNT=$(echo "$BE_CONSOLE" | wc -l | tr -d ' ')
    warn "后端发现 ${BE_CONSOLE_COUNT} 处 console.log，应使用 logger 工具"
  else
    pass "后端未发现 console.log，使用 logger 规范"
  fi

  # 检查 lib 层核心文件
  BE_LIB_FILES=(
    "$BACKEND_DIR/lib/response.ts:统一响应处理"
    "$BACKEND_DIR/lib/logger.ts:日志工具"
  )
  for entry in "${BE_LIB_FILES[@]}"; do
    file="${entry%%:*}"
    desc="${entry##*:}"
    if [ -f "$file" ]; then
      pass "文件存在: $file ($desc)"
    else
      warn "建议创建: $file ($desc)"
    fi
  done
fi

echo ""
echo "=========================================="
echo "  校验结果汇总"
echo "=========================================="
echo "  错误: $ERRORS"
echo "  警告: $WARNINGS"
echo "=========================================="

if [ "$ERRORS" -gt 0 ]; then
  echo ""
  echo "❌ 架构规范校验未通过，请修复以上错误后重试"
  exit 1
else
  echo ""
  echo "✅ 架构规范校验通过"
  exit 0
fi
