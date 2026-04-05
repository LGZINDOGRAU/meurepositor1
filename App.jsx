
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const fmt = (n, prefix = "R$") =>
  `${prefix} ${Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtUSD = (n) =>
  `$ ${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899"];

const Field = ({ label, value, onChange, prefix, type = "number", step = "0.01" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5 }}>
      {label}
    </label>
    <div style={{ display: "flex", alignItems: "center", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 6, overflow: "hidden" }}>
      {prefix && (
        <span style={{ padding: "10px 12px", background: "#1e293b", color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, borderRight: "1px solid #334155" }}>
          {prefix}
        </span>
      )}
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
          padding: "10px 12px"
        }}
      />
    </div>
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12,
    padding: 24, ...style
  }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
    <div style={{ width: 3, height: 18, background: "#f59e0b", borderRadius: 2 }} />
    <h2 style={{ margin: 0, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2 }}>
      {children}
    </h2>
  </div>
);

const BigNumber = ({ label, value, color = "#f59e0b", sub }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5 }}>{label}</span>
    <span style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</span>
    {sub && <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>{sub}</span>}
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ margin: 0, color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          {payload[0].name}: {fmt(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [peso, setPeso] = useState("1000");
  const [precoPorKg, setPrecoPorKg] = useState("5.00");
  const [cotacao, setCotacao] = useState("5.20");
  const [frete, setFrete] = useState("800");
  const [seguro, setSeguro] = useState("200");
  const [ii, setIi] = useState("20");
  const [ipi, setIpi] = useState("10");
  const [pis, setPis] = useState("2.1");
  const [cofins, setCofins] = useState("9.65");
  const [icms, setIcms] = useState("17");
  const [despesas, setDespesas] = useState("500");

  const calc = useMemo(() => {
    const pesoN = parseFloat(peso) || 0;
    const precoN = parseFloat(precoPorKg) || 0;
    const cotN = parseFloat(cotacao) || 0;
    const freteN = parseFloat(frete) || 0;
    const seguroN = parseFloat(seguro) || 0;
    const iiPct = parseFloat(ii) || 0;
    const ipiPct = parseFloat(ipi) || 0;
    const pisPct = parseFloat(pis) || 0;
    const cofinsPct = parseFloat(cofins) || 0;
    const icmsPct = parseFloat(icms) || 0;
    const despN = parseFloat(despesas) || 0;

    const valorMercadoriaUSD = pesoN * precoN;
    const valorMercadoriaBRL = valorMercadoriaUSD * cotN;
    const freteBRL = freteN;
    const seguroBRL = seguroN;
    const cif = valorMercadoriaBRL + freteBRL + seguroBRL;
    const valorII = cif * (iiPct / 100);
    const valorIPI = (cif + valorII) * (ipiPct / 100);
    const basePC = cif + valorII + valorIPI;
    const valorPIS = basePC * (pisPct / 100);
    const valorCOFINS = basePC * (cofinsPct / 100);
    const baseICMS = cif + valorII + valorIPI + valorPIS + valorCOFINS + despN;
    const valorICMS = (baseICMS / (1 - icmsPct / 100)) * (icmsPct / 100);
    const totalTributos = valorII + valorIPI + valorPIS + valorCOFINS + valorICMS;
    const total = valorMercadoriaBRL + freteBRL + seguroBRL + totalTributos + despN;

    return {
      valorMercadoriaUSD, valorMercadoriaBRL, freteBRL, seguroBRL,
      cif, valorII, valorIPI, valorPIS, valorCOFINS, valorICMS,
      totalTributos, total,
      custoPorKg: pesoN > 0 ? total / pesoN : 0,
      pieData: [
        { name: "Mercadoria", value: valorMercadoriaBRL },
        { name: "Frete", value: freteBRL },
        { name: "Seguro", value: seguroBRL },
        { name: "II", value: valorII },
        { name: "IPI", value: valorIPI },
        { name: "PIS + COFINS", value: valorPIS + valorCOFINS },
        { name: "ICMS", value: valorICMS },
        { name: "Desp. Aduaneiras", value: despN },
      ].filter(d => d.value > 0),
      barData: [
        { name: "Mercadoria", value: valorMercadoriaBRL },
        { name: "Frete & Seguro", value: freteBRL + seguroBRL },
        { name: "II", value: valorII },
        { name: "IPI", value: valorIPI },
        { name: "PIS/COFINS", value: valorPIS + valorCOFINS },
        { name: "ICMS", value: valorICMS },
        { name: "Desp. Adu.", value: despN },
      ].filter(d => d.value > 0),
    };
  }, [peso, precoPorKg, cotacao, frete, seguro, ii, ipi, pis, cofins, icms, despesas]);

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f1f5f9", fontFamily: "Georgia, serif", padding: "32px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 6 }}>
          <div style={{ fontSize: 32 }}>📦</div>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase" }}>Calculadora de</div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Importação</h1>
          </div>
        </div>
        <p style={{ margin: 0, color: "#475569", fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Custo total da carga · Tributos · Valor final em BRL</p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "380px 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionTitle>Carga & Câmbio</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Peso total (kg)" value={peso} onChange={setPeso} prefix="KG" />
              <Field label="Preço por kg (USD)" value={precoPorKg} onChange={setPrecoPorKg} prefix="$" />
              <Field label="Cotação do Dólar" value={cotacao} onChange={setCotacao} prefix="R$" />
            </div>
          </Card>
          <Card>
            <SectionTitle>Custos Adicionais (R$)</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Frete Internacional" value={frete} onChange={setFrete} prefix="R$" />
              <Field label="Seguro" value={seguro} onChange={setSeguro} prefix="R$" />
              <Field label="Despesas Aduaneiras" value={despesas} onChange={setDespesas} prefix="R$" />
            </div>
          </Card>
          <Card>
            <SectionTitle>Alíquotas de Tributos (%)</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="II (%)" value={ii} onChange={setIi} />
              <Field label="IPI (%)" value={ipi} onChange={setIpi} />
              <Field label="PIS (%)" value={pis} onChange={setPis} />
              <Field label="COFINS (%)" value={cofins} onChange={setCofins} />
              <Field label="ICMS (%)" value={icms} onChange={setIcms} />
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              <BigNumber label="Valor Total Final" value={fmt(calc.total)} color="#f59e0b" />
              <BigNumber label="Total Tributos" value={fmt(calc.totalTributos)} color="#ef4444" />
              <BigNumber label="Custo / kg" value={fmt(calc.custoPorKg)} color="#10b981" sub={`Mercadoria: ${fmtUSD(calc.valorMercadoriaUSD)}`} />
            </div>
          </Card>

          <Card>
            <SectionTitle>Base CIF (Custo + Seguro + Frete)</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { label: "Mercadoria (BRL)", value: fmt(calc.valorMercadoriaBRL), sub: fmtUSD(calc.valorMercadoriaUSD) },
                { label: "Frete", value: fmt(calc.freteBRL) },
                { label: "Seguro", value: fmt(calc.seguroBRL) },
              ].map((item, i) => (
                <div key={i} style={{ background: "#020617", borderRadius: 8, padding: 14, border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 18, color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{item.value}</div>
                  {item.sub && <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{item.sub}</div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 12, background: "#020617", borderRadius: 8, border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94a3b8" }}>Total CIF</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: "#f59e0b", fontWeight: 700 }}>{fmt(calc.cif)}</span>
            </div>
          </Card>

          <Card>
            <SectionTitle>Detalhamento de Tributos</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {[
                { label: "II", value: calc.valorII, color: "#ef4444" },
                { label: "IPI", value: calc.valorIPI, color: "#f59e0b" },
                { label: "PIS", value: calc.valorPIS, color: "#10b981" },
                { label: "COFINS", value: calc.valorCOFINS, color: "#3b82f6" },
                { label: "ICMS", value: calc.valorICMS, color: "#8b5cf6" },
              ].map((t, i) => (
                <div key={i} style={{ background: "#020617", borderRadius: 8, padding: 12, border: `1px solid ${t.color}33`, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: t.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2, marginBottom: 6 }}>{t.label}</div>
                  <div style={{ fontSize: 14, color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{fmt(t.value).replace("R$ ", "")}</div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>Composição do Custo</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={calc.pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {calc.pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8" }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <SectionTitle>Custo por Componente</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={calc.barData} margin={{ top: 0, right: 10, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fill: "#6b7280" }} angle={-35} textAnchor="end" />
                  <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fill: "#6b7280" }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {calc.barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div style={{ background: "#f59e0b", borderRadius: 12, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#78350f", letterSpacing: 2, textTransform: "uppercase" }}>💰 Valor Total da Importação</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#1c1917", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.2 }}>{fmt(calc.total)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#78350f", letterSpacing: 2, textTransform: "uppercase" }}>Tributos representam</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1c1917", fontFamily: "'JetBrains Mono', monospace" }}>
                {calc.total > 0 ? ((calc.totalTributos / calc.total) * 100).toFixed(1) : "0.0"}%
              </div>
              <div style={{ fontSize: 11, color: "#92400e", fontFamily: "'JetBrains Mono', monospace" }}>do custo total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
