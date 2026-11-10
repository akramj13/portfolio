// Posts export their details as `metadata` next to the default MDX component.
declare module "*.mdx" {
  export const metadata: import("@/content/posts").PostMeta;
}
