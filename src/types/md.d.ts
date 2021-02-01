declare module '*.mdx' {
  /**
   * This type definition isn't entirely accurate. The underlying component would be happy to
   * accept more attributes than this type signature will allow. However, the precise definition
   * of those extra attributes is defined by the markdown-component-loader at runtime based on
   * configuration data.
   * Adding 'propObj' so the mdx files are open to any props that are passed
   */
  interface MarkdownComponentProps {
    className?: string;
    style?: Record<string, string>;
    propObj?: unknown;
  }

  /**
   * The naming is a little unfortunate. The function exported and the type of that function
   * share the same name. The type name was chosen by us to comport with the React naming style.
   * The underlying function name was chosen by markdown-component-loader.
   */
  type MarkdownComponent = React.FunctionComponent<MarkdownComponentProps>;
  const MarkdownComponent: MarkdownComponent;
  export default MarkdownComponent;
}
