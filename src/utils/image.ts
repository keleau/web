export type ImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9'

/**
 * 生成用于展示的占位视觉图，避免依赖站点原始素材。
 */
export function artwork(prompt: string, imageSize: ImageSize = 'square_hd'): string {
  const query = `prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?${query}`
}
