/**
 * Shape of the Postgres schema in supabase/migrations.
 *
 * Hand-written for now. Once the project exists you can replace this file with
 * the generated version and keep it honest automatically:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 *
 * Until then: change a migration, change this file.
 */

export type EducationLevel = 'junior_high' | 'senior_high' | 'college' | 'other';
export type UploadKind = 'document' | 'image' | 'audio';
export type UploadStatus = 'pending' | 'processing' | 'ready' | 'failed';
export type NoteSource = 'manual' | 'ocr' | 'transcript' | 'ai';

/** Columns every table carries. */
interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface Profile extends Timestamps {
  /** Same value as `auth.users.id` — the profile IS the user record. */
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  school: string | null;
  education_level: EducationLevel | null;
}

export interface Subject extends Timestamps {
  id: string;
  user_id: string;
  name: string;
  /** Hex from the design system palette. */
  color: string;
  icon: string | null;
  position: number;
}

export interface Folder extends Timestamps {
  id: string;
  user_id: string;
  subject_id: string;
  /** Null at the top level. Self-referencing, so depth is a UI concern. */
  parent_id: string | null;
  name: string;
  position: number;
}

export interface Upload extends Timestamps {
  id: string;
  user_id: string;
  subject_id: string | null;
  folder_id: string | null;
  bucket: string;
  /** Path within the bucket, always prefixed with the owner's user id. */
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  kind: UploadKind;
  status: UploadStatus;
  error_message: string | null;
}

export interface Note extends Timestamps {
  id: string;
  user_id: string;
  subject_id: string | null;
  folder_id: string | null;
  upload_id: string | null;
  title: string;
  content: string | null;
  source: NoteSource;
}

/**
 * Columns the database fills in itself. Splitting these out gives Insert types
 * that only require what a client actually has to provide.
 */
type Generated = 'id' | 'created_at' | 'updated_at';

type InsertOf<T, Required extends keyof T = never> = Omit<T, Generated | Required> &
  Partial<Pick<T, Extract<Generated, keyof T>>> &
  Pick<T, Required>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: InsertOf<Profile, 'id'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      subjects: {
        Row: Subject;
        Insert: InsertOf<Subject, 'user_id' | 'name'>;
        Update: Partial<Omit<Subject, 'id' | 'user_id' | 'created_at'>>;
      };
      folders: {
        Row: Folder;
        Insert: InsertOf<Folder, 'user_id' | 'subject_id' | 'name'>;
        Update: Partial<Omit<Folder, 'id' | 'user_id' | 'created_at'>>;
      };
      uploads: {
        Row: Upload;
        Insert: InsertOf<Upload, 'user_id' | 'storage_path' | 'file_name' | 'kind'>;
        Update: Partial<Omit<Upload, 'id' | 'user_id' | 'created_at'>>;
      };
      notes: {
        Row: Note;
        Insert: InsertOf<Note, 'user_id' | 'title'>;
        Update: Partial<Omit<Note, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
};

/** Storage buckets created by the migration. */
export const BUCKETS = {
  uploads: 'uploads',
  avatars: 'avatars',
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];
