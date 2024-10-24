'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/servers';

interface Question {
  id: string;
  user_id: string;
  question: string;
  created_at: string;
}

export default function Sidebar({ userId }: { userId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, user_id, question, created_at') 
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        console.log('Fetched questions:', data);
        setQuestions(data || []);
      }
    };

    if (userId) fetchHistory();

    // Subscribe to Supabase changes for new questions
    const channel = supabase
      .channel('public:questions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'questions' }, (payload) => {
        const newQuestion = payload.new as Question;
        if (newQuestion?.user_id === userId) {
          setQuestions((prev) => [newQuestion, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <aside className="fixed top-0 left-0 h-full w-[300px] bg-gray-100 p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-black">Your History</h2>
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
        <ul className="space-y-2">
          {questions.length === 0 ? (
            <li>No questions yet!</li>
          ) : (
            questions.map((q) => (
              <li key={q.id} className="p-2 bg-white rounded-md shadow-md text-black">
                {q.question}
                <small className="block text-xs text-gray-500">
                  {new Date(q.created_at).toLocaleString()}
                </small>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}
