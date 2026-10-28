"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Printer,
  Zap,
  Percent,
  RefreshCw,
  Calculator,
  TrendingUp,
  PackageCheck,
  Info,
} from "lucide-react";

export default function Home() {
  // Inputs da Peça / Projeto (Iniciam em branco)
  const [pesoPeca, setPesoPeca] = useState<string>("");
  const [tempoImpressaoHoras, setTempoImpressaoHoras] = useState<string>("");
  const [tempoImpressaoMin, setTempoImpressaoMin] = useState<string>("");
  const [quantidadePecas, setQuantidadePecas] = useState<string>("");

  // Inputs do Filamento (Com valores padrão solicitados)
  const [precoRolo, setPrecoRolo] = useState<string>("110");
  const [pesoRolo, setPesoRolo] = useState<string>("1000");

  // Inputs da Impressora & Energia (Com valores padrão solicitados)
  const [potenciaW, setPotenciaW] = useState<string>("120");
  const [tarifaKwh, setTarifaKwh] = useState<string>("1,02");
  const [valorImpressora, setValorImpressora] = useState<string>("4000");
  const [vidaUtilHoras, setVidaUtilHoras] = useState<string>("5000");

  // Outros Custos (Iniciam em branco)
  const [custoEmbalagem, setCustoEmbalagem] = useState<string>("");
  const [taxaFalha, setTaxaFalha] = useState<string>("");

  // Margem de Lucro Selecionada
  const [margemLucro, setMargemLucro] = useState<number>(100);

  // Parser auxiliar para números
  const parseVal = (val: string) => {
    const num = parseFloat(val.replace(",", "."));
    return isNaN(num) ? 0 : num;
  };

  // Cálculos principais
  const pesoPecaNum = parseVal(pesoPeca);
  const tempoHorasNum =
    parseVal(tempoImpressaoHoras) + parseVal(tempoImpressaoMin) / 60;
  const qtdPecasNum = parseVal(quantidadePecas) || 1;

  const precoRoloNum = parseVal(precoRolo);
  const pesoRoloNum = parseVal(pesoRolo) || 1000;

  const potenciaNum = parseVal(potenciaW);
  const tarifaNum = parseVal(tarifaKwh);

  const valorImpNum = parseVal(valorImpressora);
  const vidaUtilNum = parseVal(vidaUtilHoras) || 1;

  const embalagemNum = parseVal(custoEmbalagem);
  const taxaFalhaNum = parseVal(taxaFalha);

  // 1. Custo do Material
  const custoGramamaterial = pesoRoloNum > 0 ? precoRoloNum / pesoRoloNum : 0;
  const custoMaterialUnitario = pesoPecaNum * custoGramamaterial;

  // 2. Custo de Energia
  const consumoKwh = (potenciaNum / 1000) * tempoHorasNum;
  const custoEnergiaUnitario = consumoKwh * tarifaNum;

  // 3. Depreciação da Máquina
  const custoDepreciacaoHora = vidaUtilNum > 0 ? valorImpNum / vidaUtilNum : 0;
  const custoDepreciacaoUnitario = custoDepreciacaoHora * tempoHorasNum;

  // Custo Direto (Material + Energia + Depreciação + Embalagem)
  const custoDiretoUnitario =
    custoMaterialUnitario +
    custoEnergiaUnitario +
    custoDepreciacaoUnitario +
    embalagemNum;

  // 4. Adicional por Taxa de Falha
  const adicionalFalhaUnitario = custoDiretoUnitario * (taxaFalhaNum / 100);

  // Custo Total por Peça
  const custoTotalUnitario = custoDiretoUnitario + adicionalFalhaUnitario;

  // Preço de Venda e Lucro Unitário
  const precoVendaUnitario = custoTotalUnitario * (1 + margemLucro / 100);
  const lucroUnitario = precoVendaUnitario - custoTotalUnitario;

  // Totais do Lote
  const custoTotalLote = custoTotalUnitario * qtdPecasNum;
  const precoVendaLote = precoVendaUnitario * qtdPecasNum;

  // Função para limpar formulário
  const handleReset = () => {
    setPesoPeca("");
    setTempoImpressaoHoras("");
    setTempoImpressaoMin("");
    setQuantidadePecas("");
    setPrecoRolo("110");
    setPesoRolo("1000");
    setPotenciaW("120");
    setTarifaKwh("1,02");
    setValorImpressora("4000");
    setVidaUtilHoras("5000");
    setCustoEmbalagem("");
    setTaxaFalha("");
    setMargemLucro(100);
  };

  const margensPresets = [50, 75, 100, 150, 200, 300, 500];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/30 text-white">
              <Printer className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Precifica3D Pro
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Calculadora Profissional de Custos e Margem para Impressão 3D
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" /> Redefinir Padrões
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulário (Esquerda) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bloco 1: Material & Peça */}
            <Card className="bg-[#111827] border-slate-800/80 shadow-xl text-slate-200">
              <CardHeader className="pb-3 border-b border-slate-800/60">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-indigo-400">
                  <PackageCheck className="h-5 w-5" /> 1. Insumo e Peça
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Preço do Rolo (R$)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">R$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="110.00"
                        value={precoRolo}
                        onChange={(e) => setPrecoRolo(e.target.value)}
                        className="pl-9 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Peso do Rolo (g)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="1000"
                        value={pesoRolo}
                        onChange={(e) => setPesoRolo(e.target.value)}
                        className="pr-8 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500">g</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Peso da Peça (g)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Ex: 85"
                        value={pesoPeca}
                        onChange={(e) => setPesoPeca(e.target.value)}
                        className="pr-8 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500">g</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bloco 2: Energia e Tempo */}
            <Card className="bg-[#111827] border-slate-800/80 shadow-xl text-slate-200">
              <CardHeader className="pb-3 border-b border-slate-800/60">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-400">
                  <Zap className="h-5 w-5" /> 2. Energia & Tempo de Impressão
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Potência da Impressora (W)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="120"
                        value={potenciaW}
                        onChange={(e) => setPotenciaW(e.target.value)}
                        className="pr-14 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-amber-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500">Watts</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Tarifa de Energia (R$/kWh)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">R$</span>
                      <Input
                        type="text"
                        placeholder="1,02"
                        value={tarifaKwh}
                        onChange={(e) => setTarifaKwh(e.target.value)}
                        className="pl-9 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">Tempo de Impressão (Fatiador)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Horas"
                        value={tempoImpressaoHoras}
                        onChange={(e) => setTempoImpressaoHoras(e.target.value)}
                        className="pr-14 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-amber-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500">Horas</span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Minutos"
                        value={tempoImpressaoMin}
                        onChange={(e) => setTempoImpressaoMin(e.target.value)}
                        className="pr-16 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-amber-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500">Minutos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bloco 3: Depreciação & Extras */}
            <Card className="bg-[#111827] border-slate-800/80 shadow-xl text-slate-200">
              <CardHeader className="pb-3 border-b border-slate-800/60">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-400">
                  <Printer className="h-5 w-5" /> 3. Depreciação & Custos Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400">Valor da Impressora (R$)</Label>
                      <Info className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">R$</span>
                      <Input
                        type="number"
                        placeholder="4000"
                        value={valorImpressora}
                        onChange={(e) => setValorImpressora(e.target.value)}
                        className="pl-9 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Vida Útil Estimada (Horas)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="5000"
                        value={vidaUtilHoras}
                        onChange={(e) => setVidaUtilHoras(e.target.value)}
                        className="pr-14 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500">Horas</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Embalagem/Insumos (R$)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">R$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 3.50"
                        value={custoEmbalagem}
                        onChange={(e) => setCustoEmbalagem(e.target.value)}
                        className="pl-9 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Taxa de Falha / Perda (%)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Ex: 10"
                        value={taxaFalha}
                        onChange={(e) => setTaxaFalha(e.target.value)}
                        className="pr-8 bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-400">Qtd. Peças no Lote</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 1"
                      value={quantidadePecas}
                      onChange={(e) => setQuantidadePecas(e.target.value)}
                      className="bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bloco 4: Margem de Lucro */}
            <Card className="bg-[#111827] border-slate-800/80 shadow-xl text-slate-200">
              <CardHeader className="pb-3 border-b border-slate-800/60">
                <CardTitle className="text-base font-semibold flex items-center justify-between text-indigo-400">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> 4. Margem de Lucro Desejada
                  </span>
                  <span className="text-lg font-bold text-indigo-400">{margemLucro}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {margensPresets.map((pct) => (
                    <Button
                      key={pct}
                      variant="outline"
                      className={`text-xs font-semibold h-10 transition-all ${margemLucro === pct
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                          : "bg-[#0b0f19] hover:bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      onClick={() => setMargemLucro(pct)}
                    >
                      {pct}%
                    </Button>
                  ))}
                </div>

                <div className="pt-2">
                  <Label className="text-xs text-slate-400">Margem Personalizada (%)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Outra margem..."
                      value={margemLucro}
                      onChange={(e) => setMargemLucro(parseVal(e.target.value))}
                      className="bg-[#0b0f19] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
                    />
                    <Percent className="h-5 w-5 text-slate-500 shrink-0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Resumo (Direita) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-[#111827] border-indigo-900/50 shadow-2xl text-slate-200 sticky top-6">
              <CardHeader className="border-b border-slate-800/80 bg-slate-900/40">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
                  <Calculator className="h-5 w-5 text-indigo-400" />
                  Resumo da Precificação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Preço de Venda em Destaque */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-xl p-5 shadow-xl text-center space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-medium text-indigo-200">
                    Preço Recomendado por Peça
                  </span>
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {formatCurrency(precoVendaUnitario)}
                  </div>
                  <div className="text-xs text-indigo-100/90 pt-1">
                    Lucro líquido de <span className="font-semibold text-white">{formatCurrency(lucroUnitario)}</span> por unidade
                  </div>
                </div>

                {/* Composição de Custos */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Composição de Custos (Unitário)
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Insumo (Filamento)</span>
                      <span className="font-medium text-slate-200">
                        {formatCurrency(custoMaterialUnitario)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Energia Elétrica</span>
                      <span className="font-medium text-slate-200">
                        {formatCurrency(custoEnergiaUnitario)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Depreciação Máquina</span>
                      <span className="font-medium text-slate-200">
                        {formatCurrency(custoDepreciacaoUnitario)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Embalagem / Extras</span>
                      <span className="font-medium text-slate-200">
                        {formatCurrency(embalagemNum)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Provisão de Falhas ({taxaFalhaNum}%)</span>
                      <span className="font-medium text-slate-200">
                        {formatCurrency(adicionalFalhaUnitario)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 font-bold text-base text-white">
                      <span>Custo Total Unitário</span>
                      <span className="text-indigo-300">{formatCurrency(custoTotalUnitario)}</span>
                    </div>
                  </div>
                </div>

                {/* Resumo do Lote */}
                {qtdPecasNum > 1 && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Resumo do Lote ({qtdPecasNum} peças)
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-[#0b0f19] p-3 rounded-lg border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Custo Total Lote</span>
                        <span className="font-semibold text-slate-200 text-sm">
                          {formatCurrency(custoTotalLote)}
                        </span>
                      </div>
                      <div className="bg-indigo-950/40 p-3 rounded-lg border border-indigo-800/50">
                        <span className="text-[11px] text-indigo-300 block font-medium">Venda Total Lote</span>
                        <span className="font-bold text-indigo-200 text-sm">
                          {formatCurrency(precoVendaLote)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}