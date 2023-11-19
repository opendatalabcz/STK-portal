// Wraps page contents in a responsive container.
export default function Container({
  children,
}: {
  children: React.ReactNode | undefined;
}) {
  return (
    <div className="p-4 my-2 bg-white shadow-sm sm:mx-4 sm:rounded-lg sm:my-4">
      {children}
    </div>
  );
}
