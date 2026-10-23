export type InvitingSectionId =
  | 'invitations'
  | 'objections'
  | 'followups'
  | 'rules';

export type InvitationTemplate = {
  id: string;
  type: 'invitation';
  title: string;
  text: string;
  whenToUse: string;
  keywords: string[];
};

export type ObjectionCategoryId =
  | 'distrust'
  | 'time'
  | 'contacts'
  | 'products'
  | 'results'
  | 'common';

export type ObjectionItem = {
  id: string;
  type: 'objection';
  categoryId: ObjectionCategoryId;
  title: string;
  answer: string;
  why: string;
  followUpQuestion?: string;
  keywords: string[];
};

export type FollowupTemplate = {
  id: string;
  type: 'followup';
  title: string;
  text: string;
  whenToUse: string;
  keywords: string[];
};

export type CommunicationRule = {
  id: string;
  type: 'rule';
  title: string;
  text: string;
  keywords: string[];
};

export type ObjectionCategory = {
  id: ObjectionCategoryId;
  label: string;
};
