
export interface Property {
  id: number;
  imagem_principal: string;
  titulo: string;
  localizacao: string;
  preco: number;
  ativo?: boolean;
  destaque?: boolean;
  imagens?: { id: number; url: string; ordem: number }[];
}

export interface Testimonial {
  id: number;
  texto: string;
  nome: string;
  ativo?: boolean;
}

export interface BlockItem {
  titulo: string;
  descricao: string;
}

export interface BlockContent {
  titulo?: string;
  subtitulo?: string;
  texto?: string;
  imagem?: string;
  botao_texto?: string;
  botao_link?: string;
  itens?: BlockItem[];
}

export interface Block {
  id: number;
  tipo: 'hero' | 'sobre' | 'diferenciais' | 'catalogo' | 'depoimentos' | 'cta';
  ordem: number;
  ativo: boolean;
  configuracao: BlockContent;
}

export interface LandingPage {
  id: number;
  slug: string;
  status_ativa: boolean;
  titulo_seo: string;
  descricao_seo: string;
}

export interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  data_criacao: string;
}

export interface LandingData {
  titulo_seo: string;
  descricao_seo: string;
  blocos: Block[];
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
}

export interface FontConfig {
  titulo: string;
  texto: string;
}

export interface LandingConfig {
  esquema_cores: ColorScheme;
  fontes: FontConfig;
  glassmorphism: boolean;
}
