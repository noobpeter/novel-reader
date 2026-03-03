#!/bin/bash

# 小说阅读器一键启动脚本
# Novel Reader Launcher

echo "📚 启动小说阅读器..."
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查依赖
check_dependency() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 $1，请先安装${NC}"
    exit 1
  fi
}

echo "🔍 检查环境..."
check_dependency node
check_dependency npm
echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# 安装后端依赖
if [ ! -d "backend/node_modules" ] || [ ! -d "backend/node_modules/better-sqlite3" ]; then
  echo "📦 安装后端依赖..."
  cd backend
  # 如果存在旧的sqlite3，删除后重新安装
  if [ -d "node_modules/sqlite3" ]; then
    echo "   检测到旧版本数据库，清理中..."
    rm -rf node_modules package-lock.json
  fi
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 后端依赖安装失败${NC}"
    exit 1
  fi
  cd ..
  echo -e "${GREEN}✅ 后端依赖安装完成${NC}"
  echo ""
fi

# 安装前端依赖
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 安装前端依赖..."
  cd frontend && npm install && cd ..
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 前端依赖安装失败${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ 前端依赖安装完成${NC}"
  echo ""
fi

# 启动后端
echo "🚀 启动后端服务..."
cd backend
npm start &
echo -e "${GREEN}✅ 后端服务启动在 http://localhost:3000${NC}"
cd ..
echo ""

# 等待后端启动
sleep 3

# 启动前端
echo "🚀 启动前端服务..."
cd frontend
npm run dev &
echo -e "${GREEN}✅ 前端服务启动在 http://localhost:5173${NC}"
cd ..
echo ""

echo -e "${GREEN}🎉 小说阅读器启动成功！${NC}"
echo ""
echo "📖 访问地址:"
echo "   前端界面: ${YELLOW}http://localhost:5173${NC}"
echo "   后端API:  ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "⚙️  常用操作:"
echo "   - 按 Ctrl+C 停止服务"
echo "   - 后端日志: tail -f backend/npm-debug.log"
echo "   - 前端日志: tail -f frontend/npm-debug.log"
echo ""
echo "🔧 如果启动失败，请检查:"
echo "   1. 端口 3000 和 5173 是否被占用"
echo "   2. Node.js 版本是否 >= 16"
echo ""

# 保持脚本运行
wait