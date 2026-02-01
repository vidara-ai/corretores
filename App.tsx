import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Properties from './components/Properties';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AdminLanding from './components/AdminLanding';
import { LandingData, Property, Testimonial, Block } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const isSetupAdmin = window.location.pathname.startsWith('/admin');

  const [landing, setLanding] = useState<LandingData | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Se estiver na rota de admin, não carrega dados da landing pública
    if (isSetupAdmin) return;

    const loadData = async () => {
      try {
        setLoading(true);
        // Captura o slug da URL (ex: dominio.com/joao-silva -> joao-silva)
        // Se estiver na raiz, tenta pegar um padrão ou considera vazio
        const pathSlug = window.location.pathname.substring(1);
        const slug = pathSlug || 'demo'; // Fallback para 'demo' se não houver slug, para não quebrar em dev

        console.log(`Carregando dados para slug: ${slug}`);

        // 1. Buscar dados da Landing Page (Blocos + SEO)
        const { data: landingRows, error: landingError } = await supabase
          .from('public_landing_por_slug')
          .select('*')
          .eq('corretor_slug', slug)
          .order('bloco_ordem', { ascending: true });

        if (landingError) {
          console.error('Erro Supabase Landing:', landingError);
          throw landingError;
        }

        if (!landingRows || landingRows.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // 2. Buscar Imóveis
        const { data: imoveisData, error: imoveisError } = await supabase
          .from('public_imoveis_por_slug')
          .select('*')
          .eq('corretor_slug', slug);

        if (imoveisError) {
          console.error('Erro Supabase Imóveis:', imoveisError);
          // Não bloqueia a renderização se falhar imóveis, apenas loga
        }

        // 3. Normalização dos dados
        const firstRow = landingRows[0];
        
        const blocks: Block[] = landingRows.map((row: any) => ({
          id: row.bloco_id,
          tipo: row.bloco_tipo,
          ordem: row.bloco_ordem,
          ativo: row.bloco_ativo,
          configuracao: row.bloco_conteudo 
        }));

        const testimonialData: Testimonial[] = []; 

        const formattedLanding: LandingData = {
          titulo_seo: firstRow.titulo_seo,
          descricao_seo: firstRow.descricao_seo,
          blocos: blocks
        };

        setLanding(formattedLanding);
        setProperties(imoveisData || []);
        setTestimonials(testimonialData);
        
        document.title = firstRow.titulo_seo || "Corretor Prime";

      } catch (err) {
        console.error("Erro fatal na carga de dados:", err);
        setNotFound(true); 
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isSetupAdmin]);

  // Rota de Admin
  if (isSetupAdmin) {
    return <AdminLanding />;
  }

  // Lógica da Landing Pública
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-brand-accent animate-spin" />
          <p className="text-slate-400 font-light tracking-wider animate-pulse">Carregando experiência...</p>
        </div>
      </div>
    );
  }

  if (notFound || !landing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="glass-card p-12 rounded-3xl border-red-500/20 shadow-red-900/10">
          <AlertCircle size={48} className="text-red-400 mb-6 mx-auto" />
          <h1 className="font-serif text-3xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-slate-400 max-w-md mb-8">
            Não conseguimos localizar o perfil deste corretor. Verifique se o endereço está correto.
          </p>
          <a href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-semibold">
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  const sortedBlocks = [...landing.blocos].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-50 font-sans selection:bg-brand-accent selection:text-slate-900">
      <Header />
      <main>
        {sortedBlocks.map((block) => {
          if (!block.ativo) return null;
          switch (block.tipo) {
            case 'hero':
              return <Hero key={block.id} data={block.configuracao} />;
            case 'sobre':
              return <About key={block.id} data={block.configuracao} />;
            case 'diferenciais':
              return <Features key={block.id} data={block.configuracao} />;
            case 'catalogo':
              return <Properties key={block.id} properties={properties} />;
            case 'depoimentos':
              const blockTestimonials = block.configuracao.itens as unknown as Testimonial[] || testimonials;
              return <Testimonials key={block.id} testimonials={blockTestimonials} />;
            case 'cta':
              return <CTA key={block.id} data={block.configuracao} />;
            default:
              return null;
          }
        })}
      </main>
      <Footer />
    </div>
  );
}

export default App;