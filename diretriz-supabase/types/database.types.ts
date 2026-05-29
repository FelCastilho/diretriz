/**
 * Diretriz · Brand System — Supabase Database Types
 * -----------------------------------------------------------------------------
 * Hand-authored to match database/sql/supabase-schema.sql.
 * Compatible with `supabase gen types typescript` output shape:
 *   import { Database } from './database.types'
 *   const supabase = createClient<Database>(url, key)
 *
 * Regenerate with:
 *   supabase gen types typescript --project-id <ref> --schema public > database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------
export type AppRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type MembershipRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type BrandType = 'master' | 'sub'
export type SyncStatus = 'master' | 'synced' | 'unlinked'
export type VisibilityLevel = 'public' | 'private' | 'sso' | 'password'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type BlockCategory = 'texto' | 'cor' | 'tipo' | 'midia' | 'embed' | 'download'
export type ColorPalette = 'primary' | 'secondary'
export type PersonaTier = 'primary' | 'secondary' | 'tertiary'
export type VoiceRegister = 'institucional' | 'conversacional' | 'editorial'
export type VocabularyKind = 'use' | 'avoid'
export type AssetKind =
  | 'logo' | 'font' | 'icon' | 'graphic' | 'photo'
  | 'template' | 'document' | 'video' | 'audio' | 'pdf' | 'other'
export type FileFormat =
  | 'SVG' | 'PNG' | 'PDF' | 'ICO' | 'JPG' | 'WEBP' | 'GIF'
  | 'OTF' | 'TTF' | 'WOFF' | 'WOFF2'
  | 'ZIP' | 'FIG' | 'AI' | 'INDD' | 'EPS'
  | 'DOCX' | 'HTML' | 'CSS' | 'MP4' | 'MP3' | 'OTHER'
export type EmbedKind = 'Figma' | 'Vídeo' | 'Miro' | 'Drive' | 'Link'
export type ThemePreference = 'dark' | 'light'
export type AuditAction =
  | 'create' | 'update' | 'delete' | 'publish' | 'unpublish'
  | 'login' | 'logout' | 'download' | 'share' | 'upload'
  | 'access_grant' | 'access_revoke' | 'sync'

// -----------------------------------------------------------------------------
// Helper generics
// -----------------------------------------------------------------------------
type WithTimestamps = { created_at: string; updated_at: string }

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          first_name: string
          last_name: string
          full_name: string | null
          initial: string | null
          job_title: string | null
          role: AppRole
          avatar_url: string | null
          theme: ThemePreference
          bio: string | null
          last_seen_at: string | null
        } & WithTimestamps
        Insert: {
          id: string
          email?: string | null
          first_name?: string
          last_name?: string
          job_title?: string | null
          role?: AppRole
          avatar_url?: string | null
          theme?: ThemePreference
          bio?: string | null
          last_seen_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: [
          { foreignKeyName: 'profiles_id_fkey'; columns: ['id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }

      brands: {
        Row: {
          id: string
          slug: string
          name: string
          brand_type: BrandType
          parent_brand_id: string | null
          descriptor: string | null
          description: string | null
          logo_asset_id: string | null
          sync_status: SyncStatus
          is_active: boolean
          created_by: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          slug: string
          name: string
          brand_type?: BrandType
          parent_brand_id?: string | null
          descriptor?: string | null
          description?: string | null
          logo_asset_id?: string | null
          sync_status?: SyncStatus
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['brands']['Insert']>
        Relationships: [
          { foreignKeyName: 'brands_parent_brand_id_fkey'; columns: ['parent_brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] },
          { foreignKeyName: 'brands_logo_asset_fk'; columns: ['logo_asset_id']; referencedRelation: 'assets'; referencedColumns: ['id'] }
        ]
      }

      brand_memberships: {
        Row: {
          id: string
          brand_id: string
          user_id: string
          role: MembershipRole
          invited_by: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          user_id: string
          role?: MembershipRole
          invited_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['brand_memberships']['Insert']>
        Relationships: [
          { foreignKeyName: 'brand_memberships_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] },
          { foreignKeyName: 'brand_memberships_user_id_fkey'; columns: ['user_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] }
        ]
      }

      sections: {
        Row: {
          id: string
          brand_id: string
          slug: string
          label: string
          position: number
          icon: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          slug: string
          label: string
          position?: number
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['sections']['Insert']>
        Relationships: [
          { foreignKeyName: 'sections_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      pages: {
        Row: {
          id: string
          brand_id: string
          section_id: string
          slug: string
          route: string
          label: string
          eyebrow: string | null
          title: string
          lede: string | null
          visibility: VisibilityLevel
          status: ContentStatus
          sync_status: SyncStatus
          version: string
          reading_minutes: number | null
          responsible: string | null
          position: number
          published_at: string | null
          content_updated_at: string | null
          created_by: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          section_id: string
          slug: string
          route: string
          label: string
          eyebrow?: string | null
          title: string
          lede?: string | null
          visibility?: VisibilityLevel
          status?: ContentStatus
          sync_status?: SyncStatus
          version?: string
          reading_minutes?: number | null
          responsible?: string | null
          position?: number
          published_at?: string | null
          content_updated_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['pages']['Insert']>
        Relationships: [
          { foreignKeyName: 'pages_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] },
          { foreignKeyName: 'pages_section_id_fkey'; columns: ['section_id']; referencedRelation: 'sections'; referencedColumns: ['id'] }
        ]
      }

      page_tags: {
        Row: {
          id: string
          page_id: string
          label: string
          variant: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          label: string
          variant?: string | null
          position?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['page_tags']['Insert']>
        Relationships: [
          { foreignKeyName: 'page_tags_page_id_fkey'; columns: ['page_id']; referencedRelation: 'pages'; referencedColumns: ['id'] }
        ]
      }

      blocks: {
        Row: {
          id: string
          page_id: string
          category: BlockCategory
          type: string
          section_label_idx: string | null
          section_label_text: string | null
          position: number
          content: Json
          sync_status: SyncStatus
          is_locked: boolean
          created_by: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          page_id: string
          category?: BlockCategory
          type?: string
          section_label_idx?: string | null
          section_label_text?: string | null
          position?: number
          content?: Json
          sync_status?: SyncStatus
          is_locked?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['blocks']['Insert']>
        Relationships: [
          { foreignKeyName: 'blocks_page_id_fkey'; columns: ['page_id']; referencedRelation: 'pages'; referencedColumns: ['id'] }
        ]
      }

      block_revisions: {
        Row: {
          id: string
          block_id: string
          content: Json
          type: string | null
          position: number | null
          edited_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          block_id: string
          content: Json
          type?: string | null
          position?: number | null
          edited_by?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['block_revisions']['Insert']>
        Relationships: [
          { foreignKeyName: 'block_revisions_block_id_fkey'; columns: ['block_id']; referencedRelation: 'blocks'; referencedColumns: ['id'] }
        ]
      }

      assets: {
        Row: {
          id: string
          brand_id: string
          kind: AssetKind
          title: string
          description: string | null
          storage_path: string | null
          mime_type: string | null
          file_size: number | null
          width: number | null
          height: number | null
          checksum: string | null
          is_synced: boolean
          metadata: Json
          uploaded_by: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          kind: AssetKind
          title: string
          description?: string | null
          storage_path?: string | null
          mime_type?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          checksum?: string | null
          is_synced?: boolean
          metadata?: Json
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['assets']['Insert']>
        Relationships: [
          { foreignKeyName: 'assets_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      asset_files: {
        Row: {
          id: string
          asset_id: string
          format: FileFormat
          storage_path: string | null
          url: string | null
          file_size: number | null
          is_primary: boolean
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          format: FileFormat
          storage_path?: string | null
          url?: string | null
          file_size?: number | null
          is_primary?: boolean
          position?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['asset_files']['Insert']>
        Relationships: [
          { foreignKeyName: 'asset_files_asset_id_fkey'; columns: ['asset_id']; referencedRelation: 'assets'; referencedColumns: ['id'] }
        ]
      }

      download_logs: {
        Row: {
          id: string
          asset_id: string | null
          asset_file_id: string | null
          user_id: string | null
          format: FileFormat | null
          created_at: string
        }
        Insert: {
          id?: string
          asset_id?: string | null
          asset_file_id?: string | null
          user_id?: string | null
          format?: FileFormat | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['download_logs']['Insert']>
        Relationships: []
      }

      colors: {
        Row: {
          id: string
          brand_id: string
          block_id: string | null
          name: string
          hex: string
          rgb: string | null
          cmyk: string | null
          pantone: string | null
          palette: ColorPalette
          usage_percentage: number | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          block_id?: string | null
          name: string
          hex: string
          rgb?: string | null
          cmyk?: string | null
          pantone?: string | null
          palette?: ColorPalette
          usage_percentage?: number | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['colors']['Insert']>
        Relationships: [
          { foreignKeyName: 'colors_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      color_combinations: {
        Row: {
          id: string
          brand_id: string
          label: string
          foreground_hex: string
          background_hex: string
          contrast_ratio: string | null
          wcag_level: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          label: string
          foreground_hex: string
          background_hex: string
          contrast_ratio?: string | null
          wcag_level?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['color_combinations']['Insert']>
        Relationships: [
          { foreignKeyName: 'color_combinations_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      typography_families: {
        Row: {
          id: string
          brand_id: string
          name: string
          classification: string | null
          source: string | null
          license: string | null
          is_primary: boolean
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          classification?: string | null
          source?: string | null
          license?: string | null
          is_primary?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['typography_families']['Insert']>
        Relationships: [
          { foreignKeyName: 'typography_families_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      typography_weights: {
        Row: {
          id: string
          family_id: string
          weight_value: number
          weight_name: string
          usage: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          weight_value: number
          weight_name: string
          usage?: string | null
          position?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['typography_weights']['Insert']>
        Relationships: [
          { foreignKeyName: 'typography_weights_family_id_fkey'; columns: ['family_id']; referencedRelation: 'typography_families'; referencedColumns: ['id'] }
        ]
      }

      typography_specimens: {
        Row: {
          id: string
          brand_id: string
          label: string
          weight: string | null
          size: string | null
          tracking: string | null
          sample_text: string | null
          font_px: number | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          label: string
          weight?: string | null
          size?: string | null
          tracking?: string | null
          sample_text?: string | null
          font_px?: number | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['typography_specimens']['Insert']>
        Relationships: [
          { foreignKeyName: 'typography_specimens_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      archetypes: {
        Row: {
          id: string
          brand_id: string
          name: string
          body: string | null
          is_primary: boolean
          percentage: number | null
          color_hex: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          body?: string | null
          is_primary?: boolean
          percentage?: number | null
          color_hex?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['archetypes']['Insert']>
        Relationships: [
          { foreignKeyName: 'archetypes_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      brand_values: {
        Row: {
          id: string
          brand_id: string
          name: string
          description: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          description?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['brand_values']['Insert']>
        Relationships: [
          { foreignKeyName: 'brand_values_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      personas: {
        Row: {
          id: string
          brand_id: string
          tier: PersonaTier
          role_label: string | null
          nickname: string | null
          wants: string | null
          fears: string | null
          portrait_asset_id: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          tier: PersonaTier
          role_label?: string | null
          nickname?: string | null
          wants?: string | null
          fears?: string | null
          portrait_asset_id?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['personas']['Insert']>
        Relationships: [
          { foreignKeyName: 'personas_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] },
          { foreignKeyName: 'personas_portrait_asset_id_fkey'; columns: ['portrait_asset_id']; referencedRelation: 'assets'; referencedColumns: ['id'] }
        ]
      }

      positioning_statements: {
        Row: {
          id: string
          brand_id: string
          audience: string | null
          tension: string | null
          category: string | null
          benefit: string | null
          reason_to_believe: string | null
          statement_template: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          audience?: string | null
          tension?: string | null
          category?: string | null
          benefit?: string | null
          reason_to_believe?: string | null
          statement_template?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['positioning_statements']['Insert']>
        Relationships: [
          { foreignKeyName: 'positioning_statements_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      positioning_pillars: {
        Row: {
          id: string
          brand_id: string
          title: string
          body: string | null
          linked_route: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          title: string
          body?: string | null
          linked_route?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['positioning_pillars']['Insert']>
        Relationships: [
          { foreignKeyName: 'positioning_pillars_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      competitors: {
        Row: {
          id: string
          brand_id: string
          label: string
          axis_x: number
          axis_y: number
          is_self: boolean
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          label: string
          axis_x: number
          axis_y: number
          is_self?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['competitors']['Insert']>
        Relationships: [
          { foreignKeyName: 'competitors_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      voice_traits: {
        Row: {
          id: string
          brand_id: string
          name: string
          body: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          body?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['voice_traits']['Insert']>
        Relationships: [
          { foreignKeyName: 'voice_traits_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      voice_examples: {
        Row: {
          id: string
          brand_id: string
          do_text: string
          dont_text: string
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          do_text: string
          dont_text: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['voice_examples']['Insert']>
        Relationships: [
          { foreignKeyName: 'voice_examples_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      voice_registers: {
        Row: {
          id: string
          brand_id: string
          register: VoiceRegister
          name: string
          usage: string | null
          example: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          register: VoiceRegister
          name: string
          usage?: string | null
          example?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['voice_registers']['Insert']>
        Relationships: [
          { foreignKeyName: 'voice_registers_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      vocabulary_categories: {
        Row: {
          id: string
          brand_id: string
          name: string
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['vocabulary_categories']['Insert']>
        Relationships: [
          { foreignKeyName: 'vocabulary_categories_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      vocabulary_words: {
        Row: {
          id: string
          category_id: string
          word: string
          kind: VocabularyKind
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          word: string
          kind: VocabularyKind
          position?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['vocabulary_words']['Insert']>
        Relationships: [
          { foreignKeyName: 'vocabulary_words_category_id_fkey'; columns: ['category_id']; referencedRelation: 'vocabulary_categories'; referencedColumns: ['id'] }
        ]
      }

      word_territories: {
        Row: {
          id: string
          brand_id: string
          name: string
          color_hex: string | null
          body: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          color_hex?: string | null
          body?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['word_territories']['Insert']>
        Relationships: [
          { foreignKeyName: 'word_territories_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      word_territory_words: {
        Row: {
          id: string
          territory_id: string
          word: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          territory_id: string
          word: string
          position?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['word_territory_words']['Insert']>
        Relationships: [
          { foreignKeyName: 'word_territory_words_territory_id_fkey'; columns: ['territory_id']; referencedRelation: 'word_territories'; referencedColumns: ['id'] }
        ]
      }

      manifestos: {
        Row: {
          id: string
          brand_id: string
          page_id: string | null
          body: string
          signed_by: string | null
          signed_year: number | null
          pdf_asset_id: string | null
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          page_id?: string | null
          body: string
          signed_by?: string | null
          signed_year?: number | null
          pdf_asset_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['manifestos']['Insert']>
        Relationships: [
          { foreignKeyName: 'manifestos_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] },
          { foreignKeyName: 'manifestos_page_id_fkey'; columns: ['page_id']; referencedRelation: 'pages'; referencedColumns: ['id'] }
        ]
      }

      flags: {
        Row: {
          id: string
          brand_id: string
          number: string | null
          title: string
          body: string | null
          is_verifiable: boolean
          updated_label: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          number?: string | null
          title: string
          body?: string | null
          is_verifiable?: boolean
          updated_label?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['flags']['Insert']>
        Relationships: [
          { foreignKeyName: 'flags_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      logos: {
        Row: {
          id: string
          brand_id: string
          name: string
          description: string | null
          is_primary: boolean
          asset_id: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          description?: string | null
          is_primary?: boolean
          asset_id?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['logos']['Insert']>
        Relationships: [
          { foreignKeyName: 'logos_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] },
          { foreignKeyName: 'logos_asset_id_fkey'; columns: ['asset_id']; referencedRelation: 'assets'; referencedColumns: ['id'] }
        ]
      }

      logo_misuses: {
        Row: {
          id: string
          brand_id: string
          label: string
          description: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          label: string
          description?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['logo_misuses']['Insert']>
        Relationships: [
          { foreignKeyName: 'logo_misuses_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      logo_min_sizes: {
        Row: {
          id: string
          brand_id: string
          context: string
          min_size: string
          body: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          context: string
          min_size: string
          body?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['logo_min_sizes']['Insert']>
        Relationships: [
          { foreignKeyName: 'logo_min_sizes_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      graphics: {
        Row: {
          id: string
          brand_id: string
          name: string
          svg_markup: string | null
          asset_id: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          svg_markup?: string | null
          asset_id?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['graphics']['Insert']>
        Relationships: [
          { foreignKeyName: 'graphics_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      icons: {
        Row: {
          id: string
          brand_id: string
          name: string
          keywords: string[]
          asset_id: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          name: string
          keywords?: string[]
          asset_id?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['icons']['Insert']>
        Relationships: [
          { foreignKeyName: 'icons_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      photography_references: {
        Row: {
          id: string
          brand_id: string
          label: string
          aspect_ratio: string | null
          layout_span: string | null
          image_asset_id: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          label: string
          aspect_ratio?: string | null
          layout_span?: string | null
          image_asset_id?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['photography_references']['Insert']>
        Relationships: [
          { foreignKeyName: 'photography_references_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      photography_params: {
        Row: {
          id: string
          brand_id: string
          key: string
          value: string | null
          note: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          key: string
          value?: string | null
          note?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['photography_params']['Insert']>
        Relationships: [
          { foreignKeyName: 'photography_params_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      embeds: {
        Row: {
          id: string
          brand_id: string
          block_id: string | null
          kind: EmbedKind
          title: string
          url: string | null
          provider: string | null
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          block_id?: string | null
          kind?: EmbedKind
          title: string
          url?: string | null
          provider?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['embeds']['Insert']>
        Relationships: [
          { foreignKeyName: 'embeds_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      share_links: {
        Row: {
          id: string
          brand_id: string
          page_id: string | null
          token: string
          visibility: VisibilityLevel
          password_hash: string | null
          expires_at: string | null
          created_by: string | null
          revoked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          page_id?: string | null
          token?: string
          visibility?: VisibilityLevel
          password_hash?: string | null
          expires_at?: string | null
          created_by?: string | null
          revoked_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['share_links']['Insert']>
        Relationships: [
          { foreignKeyName: 'share_links_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] },
          { foreignKeyName: 'share_links_page_id_fkey'; columns: ['page_id']; referencedRelation: 'pages'; referencedColumns: ['id'] }
        ]
      }

      page_access_grants: {
        Row: {
          id: string
          page_id: string
          user_id: string | null
          email: string | null
          granted_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          user_id?: string | null
          email?: string | null
          granted_by?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['page_access_grants']['Insert']>
        Relationships: [
          { foreignKeyName: 'page_access_grants_page_id_fkey'; columns: ['page_id']; referencedRelation: 'pages'; referencedColumns: ['id'] }
        ]
      }

      quick_answers: {
        Row: {
          id: string
          brand_id: string
          question: string
          answer: string
          position: number
        } & WithTimestamps
        Insert: {
          id?: string
          brand_id: string
          question: string
          answer: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['quick_answers']['Insert']>
        Relationships: [
          { foreignKeyName: 'quick_answers_brand_id_fkey'; columns: ['brand_id']; referencedRelation: 'brands'; referencedColumns: ['id'] }
        ]
      }

      quick_answer_citations: {
        Row: {
          id: string
          quick_answer_id: string
          label: string
          route: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          quick_answer_id: string
          label: string
          route: string
          position?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['quick_answer_citations']['Insert']>
        Relationships: [
          { foreignKeyName: 'quick_answer_citations_quick_answer_id_fkey'; columns: ['quick_answer_id']; referencedRelation: 'quick_answers'; referencedColumns: ['id'] }
        ]
      }

      search_queries: {
        Row: {
          id: string
          brand_id: string | null
          user_id: string | null
          query: string
          result_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          brand_id?: string | null
          user_id?: string | null
          query: string
          result_count?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['search_queries']['Insert']>
        Relationships: []
      }

      audit_logs: {
        Row: {
          id: string
          brand_id: string | null
          actor_id: string | null
          action: AuditAction
          entity_type: string | null
          entity_id: string | null
          metadata: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          brand_id?: string | null
          actor_id?: string | null
          action: AuditAction
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>
        Relationships: []
      }
    }

    Views: Record<never, never>

    Functions: {
      is_brand_member: { Args: { p_brand_id: string }; Returns: boolean }
      brand_role: { Args: { p_brand_id: string }; Returns: MembershipRole }
      has_brand_role: { Args: { p_brand_id: string; p_min: MembershipRole }; Returns: boolean }
      can_read_brand: { Args: { p_brand_id: string }; Returns: boolean }
      can_read_page: { Args: { p_page_id: string }; Returns: boolean }
      log_download: { Args: { p_asset_id: string; p_format?: FileFormat; p_asset_file_id?: string }; Returns: string }
      log_search: { Args: { p_brand_id: string; p_query: string; p_result_count?: number }; Returns: string }
      write_audit: {
        Args: {
          p_brand_id: string
          p_action: AuditAction
          p_entity_type?: string
          p_entity_id?: string
          p_metadata?: Json
        }
        Returns: string
      }
    }

    Enums: {
      app_role: AppRole
      membership_role: MembershipRole
      brand_type: BrandType
      sync_status: SyncStatus
      visibility_level: VisibilityLevel
      content_status: ContentStatus
      block_category: BlockCategory
      color_palette: ColorPalette
      persona_tier: PersonaTier
      voice_register: VoiceRegister
      vocabulary_kind: VocabularyKind
      asset_kind: AssetKind
      file_format: FileFormat
      embed_kind: EmbedKind
      theme_preference: ThemePreference
      audit_action: AuditAction
    }

    CompositeTypes: Record<never, never>
  }
}

// -----------------------------------------------------------------------------
// Convenience row-type aliases
// -----------------------------------------------------------------------------
type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update']
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T]

export type Profile = Tables<'profiles'>
export type Brand = Tables<'brands'>
export type Section = Tables<'sections'>
export type Page = Tables<'pages'>
export type Block = Tables<'blocks'>
export type Asset = Tables<'assets'>
export type Color = Tables<'colors'>
export type Persona = Tables<'personas'>
export type Flag = Tables<'flags'>
