'use client';

export function Footer() {
  return (
    <div
      className="bg-[#c0c0c0] border-t-2 border-t-white px-4 py-1 flex items-center justify-between text-xs"
      style={{ fontFamily: "'VT323', 'MS Sans Serif', monospace" }}
    >
      <div className="flex items-center gap-4">
        <span className="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2">
          Ready
        </span>
        <span className="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2">
          Connected
        </span>
      </div>
      <span className="text-[#808080]">BadgerPanel &copy; {new Date().getFullYear()}</span>
    </div>
  );
}

export default Footer;
