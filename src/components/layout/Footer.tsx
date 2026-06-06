export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full px-6 md:px-16 lg:px-[120px] py-8"
      style={{ backgroundColor: "#1a1c18" }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-bold" style={{ fontSize: 16, color: "#ffffff" }}>
            BARA NEWS
          </span>
          <span style={{ fontSize: 13, color: "#868685" }}>
            교육·문화예술 전문 온라인 신문
          </span>
          <span style={{ fontSize: 12, color: "#868685" }}>
            © {year} 주식회사 일리아. All rights reserved.
          </span>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <span style={{ fontSize: 12, color: "#868685" }}>운영사</span>
          <a
            href="https://ylia.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
              textDecoration: "none",
              transition: "text-decoration 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            ylia.io →
          </a>
        </div>
      </div>
    </footer>
  );
}
