export function Button({ className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-black transition hover:opacity-90",
        className
      ].join(" ")}
      {...props}
    />
  );
}
