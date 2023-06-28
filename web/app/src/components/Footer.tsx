export default function Footer() {
  return (
    <footer className="flex flex-row justify-center items-baseline py-3 px-4 space-x-8 bg-gray-100 text-slate-600">
      <p>
        <a
          href="https://opendatalab.cz/"
          target="_blank"
          className="underline underline-offset-2 decoration-dotted decoration-1"
        >
          OpenDataLab
        </a>{" "}
        2023, portál vznikl jako{" "}
        <a
          href=""
          target="_blank"
          className="underline underline-offset-2 decoration-dotted decoration-1"
        >
          diplomová práce
        </a>{" "}
        na{" "}
        <a
          href="https://fit.cvut.cz/"
          target="_blank"
          className="underline underline-offset-2 decoration-dotted decoration-1"
        >
          FIT ČVUT
        </a>
      </p>
    </footer>
  );
}
