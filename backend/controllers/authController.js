exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  // Simulate success
  res.status(201).json({
    success: true,
    message: 'User registered successfully (Mock API)',
    token: 'mock-jwt-token-abcdefg',
    user: {
      id: 'mock-user-123',
      name,
      email,
    },
  });
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Simulate success
  res.status(200).json({
    success: true,
    message: 'User logged in successfully (Mock API)',
    token: 'mock-jwt-token-abcdefg',
    user: {
      id: 'mock-user-123',
      name: 'Your Name',
      email,
    },
  });
};

exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: 'mock-user-123',
      name: 'Your Name',
      email: 'john.doe@example.com',
      createdAt: new Date(),
    },
  });
};
