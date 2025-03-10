export default function Contact() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">اتصل بنا</h1>
      <p className="text-lg mb-4">
        يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف:
      </p>
      <ul className="list-disc list-inside">
        <li>
          البريد الإلكتروني:{" "}
          <a href="mailto:hosseen@gmail.com" className="text-blue-500">
            hosseen@gmail.com
          </a>
        </li>
        <li>الهاتف: 00966581806737</li>
      </ul>
    </div>
  );
}
