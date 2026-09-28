# Tag Agent

一个面向 UE5 GameplayTag 设计的本地 AI 工具。用户可以选择题材和策划视角，与 AI 助手逐步搭建标签体系，或一键生成完整候选，再手动增删改、导出为 UE5 可导入的 INI / CSV / JSON / C++，并生成按 GE / GA / GC / AttributeSet / Component 分类的使用文档。

## 功能

- 引导搭建：生存、武侠、西幻、科幻四种题材，以及策划、3C 策划、交互工程师、UI 设计四种角色视角。
- AI 助手：支持 OpenAI 兼容接口，可在页面右上角设置 API 地址、模型和 Key。
- 标签结构：思维导图可缩放、拖拽、全屏；节点可点击编辑，右上角加号添加子标签，左下角箭头插入同级标签。
- 标签管理：模块化增删改、折叠层级、搜索，手动添加大类。
- 导出：INI、CSV、JSON、C++，以及 Markdown / HTML 使用文档。
- 市场：本地发布与导入标签包（付费下载当前为演示占位）。

## 运行

需要已安装 Node.js 18 或更高版本。

```powershell
node server.js
```

然后打开 `http://localhost:8787/`。

Windows 下也可以双击 `启动服务器.bat`（普通浏览器）或 `启动App.vbs`（Edge/Chrome 应用窗口）。

## API 配置

首次启动后，在页面右上角齿轮按钮中填写：

- API 地址，例如 `https://api.deepseek.com/v1`
- 模型名称，例如 `deepseek-chat`
- API Key

配置会保存在本地 `data/db.json`，不会上传到云端。也可以复制 `config.example.json` 为 `config.json` 手动配置。

## 项目结构

```text
server.js            本地 HTTP 服务与 API
lib/guidance.js      题材、角色、分步引导与离线回退
lib/llm-guide.js     AI 提示词与返回解析
lib/llm.js           OpenAI 兼容接口调用
lib/store.js         本地 JSON 持久化
lib/export.js        INI / CSV / JSON / C++ 导出
lib/usage-doc.js     使用文档生成
public/              前端页面
```

> 注意：`config.json` 和 `data/` 已被 `.gitignore` 忽略，不会提交到仓库。
