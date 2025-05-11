const supabase = supabase.createClient(
    'https://ezmppukfhgzsfekakkix.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXBwdWtmaGd6c2Zla2Fra2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY2MDgsImV4cCI6MjA2MjA0MjYwOH0.0FJr4AhMbyImCTlNmqMykiKnNRYeXYT5soMS8O4POYA'
  );
  
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      window.location.href = "index.html";
    }
  });
  
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
      const repeatPassword = document.getElementById('repeat-password-input').value;
      const username = document.getElementById('username-input').value;
  
      if (password !== repeatPassword) {
        alert('Passwords do not match');
        return;
      }
  
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        alert('Sign-up error: ' + error.message);
      } else {
        const user = data.user;
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: user.id, username }]);
  
          if (profileError) {
            alert('Error saving username: ' + profileError.message);
          } else {
            alert('Sign-up successful! Check your email to confirm.');
            signupForm.reset();
          }
        }
      }
    });
  }
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        alert('Login error: ' + error.message);
      } else {
        alert('Login successful!');
        window.location.href = "index.html";
      }
    });
  }
  