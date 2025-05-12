const { createClient } = supabase;

const supabaseClient = createClient(
  'https://ezmppukfhgzsfekakkix.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXBwdWtmaGd6c2Zla2Fra2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY2MDgsImV4cCI6MjA2MjA0MjYwOH0.0FJr4AhMbyImCTlNmqMykiKnNRYeXYT5soMS8O4POYA'
);

// ✅ Redirect if already logged in
supabaseClient.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    console.log("✅ Already logged in, redirecting...");
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

    console.log("📩 Signing up:", email);

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("❌ Signup error:", error);
      alert('Sign-up error: ' + error.message);
    } else {
      console.log("✅ Sign-up initiated. Awaiting email confirmation.");
      alert('Sign-up successful! Check your email to confirm.');
      /////////
      const user = data.user;
  if (user && user.id) {
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert([{ id: user.id, username }]);

    if (profileError) {
      console.error("❌ Failed to insert profile:", profileError);
    } else {
      console.log("✅ Profile inserted on signup");
    }
  }
  ////////
      signupForm.reset();
    }
  });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    console.log("🔐 Logging in:", email);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Login error:", error);
      alert('Login error: ' + error.message);
    } else {
      console.log("✅ Login successful:", data);

      const user = data.user;
      const usernameInput = document.getElementById('username-input');
      const username = usernameInput ? usernameInput.value : null;

      if (user && username) {
        // Check if profile already exists
        const { data: existingProfile, error: fetchError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error("❌ Profile fetch error:", fetchError);
          } else {
            const { error: insertError } = await supabaseClient
              .from('profiles')
              .insert([{ id: user.id, username }]);

            if (insertError) {
              console.error("❌ Profile insert failed:", insertError);
              alert("Login succeeded, but saving username failed.");
            } else {
              console.log("✅ Username saved to profile");
            }
          }
        }
      }

      alert('Login successful!');
      window.location.href = "index.html";
    }
  });
}

