// Validation middleware for user inputs
export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: "Name, email, and password are required" 
    });
  }

  if (email.length < 5 || !email.includes("@")) {
    return res.status(400).json({ 
      message: "Invalid email format" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      message: "Password must be at least 6 characters" 
    });
  }

  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      message: "Name must be between 2 and 50 characters" 
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      message: "Email and password are required" 
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ 
      message: "Invalid email format" 
    });
  }

  next();
};

export const validateCar = (req, res, next) => {
  const { brand, model, year, pricePerDay } = req.body;

  if (!brand || !model || !year || !pricePerDay) {
    return res.status(400).json({ 
      message: "Brand, model, year, and pricePerDay are required" 
    });
  }

  if (isNaN(year) || year < 1950 || year > new Date().getFullYear() + 1) {
    return res.status(400).json({ 
      message: "Invalid year" 
    });
  }

  if (isNaN(pricePerDay) || pricePerDay <= 0) {
    return res.status(400).json({ 
      message: "Price per day must be a positive number" 
    });
  }

  if (brand.length < 2 || brand.length > 50) {
    return res.status(400).json({ 
      message: "Brand must be between 2 and 50 characters" 
    });
  }

  if (model.length < 2 || model.length > 50) {
    return res.status(400).json({ 
      message: "Model must be between 2 and 50 characters" 
    });
  }

  next();
};

export const validateReservation = (req, res, next) => {
  const { carId, startDate, endDate } = req.body;

  if (!carId || !startDate || !endDate) {
    return res.status(400).json({ 
      message: "Car ID, start date, and end date are required" 
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ 
      message: "Invalid date format" 
    });
  }

  if (start < now) {
    return res.status(400).json({ 
      message: "Start date cannot be in the past" 
    });
  }

  if (end <= start) {
    return res.status(400).json({ 
      message: "End date must be after start date" 
    });
  }

  next();
};
