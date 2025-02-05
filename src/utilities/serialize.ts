/**
 * 将 MDX 内容序列化为 HTML，并生成唯一的 ID
 * TODO:
 * Do we really need to implement this?
 * Did payload have build-in function?
 */
type SerializedNode = {
  root?: {
    children: SerializedNode[]
  }
  type?: string
  tag?: string
  text?: string
  children?: SerializedNode[]
  mode?: string
  format?: number | string
  [key: string]: unknown
}

// 用于生成唯一ID的计数器
const headingCounts: { [key: string]: number } = {}

// 自定义的 HTML 转义函数，保留单引号
// 不然就会变成 "isn&#39;t" 而不是 "isn't"
function customEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  // 不转义单引号
  // .replace(/'/g, '&#39;')
}

export function serialize(node: SerializedNode): string {
  // Handle root node
  if (node.root) {
    return node.root.children.map((child) => serialize(child)).join('')
  }

  // Handle text nodes
  if (node.mode === 'normal' && node.text) {
    return customEscape(node.text)
  }

  // Handle heading nodes
  if (node.type === 'heading' && node.tag) {
    const children = node.children ? node.children.map((child) => serialize(child)).join('') : ''

    // 简化 ID 生成逻辑
    let id = children
      .toLowerCase()
      .trim()
      // 只保留字母、数字和连字符
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      // 限制长度
      .substring(0, 50)

    // 如果 ID 为空或太短，使用更简单的回退方案
    if (!id || id.length < 2) {
      id = `h${node.tag.charAt(1)}-${Date.now()}`
    }

    // 确保 ID 唯一
    if (headingCounts[id]) {
      headingCounts[id]++
      id = `${id}-${headingCounts[id]}`
    } else {
      headingCounts[id] = 1
    }

    // 添加换行符使输出更易读
    const output = `<${node.tag} id="${id}">${children}</${node.tag}>`
    return output
  }

  // Handle paragraph nodes
  if (node.type === 'paragraph') {
    const children = node.children ? node.children.map((child) => serialize(child)).join('') : ''
    return `<p>${children}</p>`
  }

  // Handle other nodes with children
  if (node.children) {
    return node.children.map((child) => serialize(child)).join('')
  }

  return ''
}
