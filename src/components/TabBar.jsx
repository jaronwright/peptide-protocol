export default function TabBar({ tabs, tab, onSelect }) {
  return (
    <div className="border-b border-white/[0.08] bg-dark-nav sticky top-0 z-20">
      <div className="max-w-[860px] mx-auto flex overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            className="gb bg-transparent border-none font-sans whitespace-nowrap"
            onClick={() => onSelect(t.id)}
            style={{
              padding: '13px 18px',
              fontSize: 12,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#F0F2F5' : '#52525B',
              borderBottom: tab === t.id ? '2px solid #4F8CF7' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
