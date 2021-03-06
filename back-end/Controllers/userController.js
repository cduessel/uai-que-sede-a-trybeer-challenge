const { Router } = require('express');

const service = require('../Service/userService');

const register = Router();

const { createToken } = require('../Middlewares/webTokenMiddleware');

const validateEmail = (email) => {
  const regexEmail = RegExp(/\S+@\S+\.\S+/, 'i');
  return regexEmail.test(email);
};

register.post('/', async (req, res) => {
  try {
    const { name, email, password, role = 'client' } = req.body;

    if (!/^[A-Za-z \s]{12,}$/.test(name)) {
      return res.status(401).json({
        message: 'O nome deve conter, no mínimo, 12 letras, sem números ou caracteres especiais',
        ok: false,
      });
    }

    if (!email || !validateEmail) {
      return res.status(400).json({
        message: 'Email inválido. Um email válido possui o formato <nome>@<domínio>',
        ok: false,
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(401).json({ message: 'Email ou senha incorreto.', ok: false });
    }

    if (!(role === 'client' || role === 'administrator')) {
      return res.status(401).json({ message: 'Role não esperado.', ok: false });
    }

    const newUser = await service.create(name, email, password, role);

    if (newUser.error) {
      return res.status(newUser.statusCode).json({ message: newUser.message, ok: false });
    }
    const token = createToken({
      id: newUser.id,
      email,
      role,
      iss: 'post_api',
    });

    res.status(201).json({ user: { name, email, role }, token, ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Algo deu errado.', ok: false });
  }
});

module.exports = register;
