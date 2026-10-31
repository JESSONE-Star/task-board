export type ToastKind = 'create' | 'update' | 'move' | 'delete' | 'star' | 'urgent' | 'filter' | 'reset' | 'theme'

const messages: Record<ToastKind, string[]> = {
  create: ['新任务已就位，开干吧！', '好记性不如烂看板，已记下 ✍️', '又消灭了一个脑子里的待办'],
  update: ['任务信息已更新，细节决定成败', '改好了，继续推进！', '已保存你的最新想法 💡'],
  move: ['任务已流转，节奏感拉满', '状态切换成功，继续加油 🚀', '进度 +1，看板已同步'],
  delete: ['任务已移除，断舍离成功', '清理完毕，轻装上阵', '这一项已经从看板消失'],
  star: ['星标已切换，重要的事要显眼', '已标记关注，别让它溜走 ⭐', '优先级已调整'],
  urgent: ['紧急标记已切换，保持专注', '红色警戒，优先处理 🔥', '紧急状态已更新'],
  filter: ['筛选已生效，专注当下分类', '已按分类过滤看板', '视图已切换'],
  reset: ['看板已清空，重新出发吧', '一切归零，新的开始', '数据已重置'],
  theme: ['主题已切换，换个心情继续', '新皮肤上线，好看吗？', '主题切换成功 🎨']
}

export function randomMessage(kind: ToastKind): string {
  const pool = messages[kind] || messages.update
  return pool[Math.floor(Math.random() * pool.length)]
}