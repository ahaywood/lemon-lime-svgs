/**
 * Template files for different frameworks
 */
export const templates = {
    react: `interface Props {
  size?: number;
  id: string;
  className?: string;
}

const Icon = ({ className, size = 24, id }: Props) => {
  return (
    <svg width={size} height={size} className={className}>
      <use href={\`/images/icons/sprite.svg#\${id}\`}></use>
    </svg>
  );
};

export default Icon;`,
    svelte: `<script lang="ts">
  const { id, size = 24, ...props } = $props();
</script>

<svg {...props} width={size} height={size}>
  <use href={\`/images/icons/sprite.svg#\${id}\`}></use>
</svg>`,
    astro: `---
const { id, size = 24, ...props } = Astro.props;
---

<svg {...props} width={size} height={size}>
  <use href={\`/images/icons/sprite.svg#\${id}\`}></use>
</svg>`
};
