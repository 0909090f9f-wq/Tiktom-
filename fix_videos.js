const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gjblqhjvlmmwyvfbqetn.supabase.co';
// ضع هنا مفتاح anon المكون من حروف وأرقام إنجليزية فقط (يبدأ بـ eyJ)
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanAndInsert() {
  console.log('⏳ جاري إرسال الفيديو التجريبي إلى تكتوم...');
  
  const { data: insertData, error: insertError } = await supabase
    .from('videos')
    .insert([
      {
        video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
        description: 'Taktom Test Video',
        username: 'taktom_dev'
      }
    ])
    .select();

  if (insertError) {
    console.error('❌ فشل إضافة الفيديو:', insertError.message);
  } else {
    console.log('✅ تم إضافة الفيديو بنجاح!');
    console.log(insertData);
  }
}

cleanAndInsert();
