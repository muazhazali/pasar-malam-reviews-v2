import { supabase } from '../supabase';

export interface Review {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  shop_id: string;
  rating: number;
  content: string;
}

export async function getReviews(shopId?: string, status: string = 'approved') {
  let query = supabase
    .from('reviews')
    .select(`
      *,
      shops (
        name,
        category
      ),
      review_votes (
        vote_type
      )
    `)
    .eq('status', status);

  if (shopId) {
    query = query.eq('shop_id', shopId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as (Review & {
    shops: { name: string; category: string };
    review_votes: { vote_type: 'up' | 'down' }[];
  })[];
}

export async function getReviewById(id: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      shops (
        name,
        category
      ),
      review_votes (
        vote_type
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Review & {
    shops: { name: string; category: string };
    review_votes: { vote_type: 'up' | 'down' }[];
  };
}

export async function createReview(reviewData: CreateReviewData) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      ...reviewData,
      user_id: userData.user.id,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

export async function updateReview(id: string, reviewData: Partial<CreateReviewData>) {
  const { data, error } = await supabase
    .from('reviews')
    .update(reviewData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function voteReview(reviewId: string, voteType: 'up' | 'down') {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  // Check if user has already voted
  const { data: existingVote, error: voteError } = await supabase
    .from('review_votes')
    .select('*')
    .eq('review_id', reviewId)
    .eq('user_id', userData.user.id)
    .single();

  if (voteError && voteError.code !== 'PGRST116') throw voteError; // PGRST116 is "not found" error

  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote if clicking the same type
      const { error } = await supabase
        .from('review_votes')
        .delete()
        .eq('id', existingVote.id);

      if (error) throw error;
    } else {
      // Update vote type if different
      const { error } = await supabase
        .from('review_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);

      if (error) throw error;
    }
  } else {
    // Create new vote
    const { error } = await supabase
      .from('review_votes')
      .insert([{
        review_id: reviewId,
        user_id: userData.user.id,
        vote_type: voteType
      }]);

    if (error) throw error;
  }
}

export async function getUserVote(reviewId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('review_votes')
    .select('vote_type')
    .eq('review_id', reviewId)
    .eq('user_id', userData.user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.vote_type as 'up' | 'down' | undefined;
}

export async function approveReview(id: string) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status: 'approved' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

export async function rejectReview(id: string) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status: 'rejected' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
} 