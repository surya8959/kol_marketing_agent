#!/bin/bash

# VANZO KOL Agent - 快速启动脚本

echo "🚀 启动 VANZO KOL Agent 开发服务器..."
echo ""
echo "📍 项目目录: $(pwd)"
echo "🌐 访问地址: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"

# 启动 Python HTTP 服务器
python3 -m http.server 8000 --directory public
