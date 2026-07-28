export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            var storedTheme = localStorage.getItem("onequicksolutions-theme");
            var theme = storedTheme === "dark" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", theme);
          } catch (error) {
            document.documentElement.setAttribute("data-theme", "light");
          }
        `,
      }}
    />
  );
}
