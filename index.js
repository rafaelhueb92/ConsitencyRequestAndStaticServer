require("dotenv/config");

const express = require("express");
const yup = require("yup");

const { PORT } = process.env;

const app = express();

const validationSchemaObject = {
  delete: yup.object().shape({
    id: yup.number().required().positive().integer(),
  }),
  put: yup.object().shape({
    name: yup.string().required(),
    id: yup.number().required().positive().integer(),
    email: yup.string().email(),
  }),
  post: yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email(),
  }),
};

const users = [
  {
    id: 1,
    name: "Rafael",
    email: "rafael@develop.com",
  },
  {
    id: 2,
    name: "Bob",
    email: "Bob@develop.com",
  },
];

app.use(express.json());
app.use(require("helmet")());

app.use("/:id", (req, res, next) => {
  if (req.method !== "GET") return res.sendStatus(405);

  if (isNaN(req.params.id)) return res.sendStatus(400);

  next();
});

app.use("/", async (req, res, next) => {
  try {
    console.log("Content Legth", req.headers["content-length"]);
    if (req.headers["content-length"] > 200) return res.sendStatus(412);

    const schemaValidation = validationSchemaObject[req.method.toLowerCase()];
    if (
      req.method === "POST" ||
      req.method === "DELETE" ||
      req.method === "PUT"
    ) {
      if (!(await schemaValidation.isValid(req.body)))
        return res.sendStatus(400);
    }
    return next();
  } catch (ex) {
    console.error(ex);
    return res.sendStatus(500);
  }
});

app.get("/", (_, res) => res.json({ users }));

app.get("/:id", (req, res) => {
  const { params } = req;
  const user = users.filter((x) => x.id == params.id);
  return user.length > 0 ? res.json(user) : res.sendStatus(404);
});

app.post("/", (req, res) => {
  const { body } = req;
  return res.json(body);
});

app.put("/", (req, res) => {
  const { body } = req;
  return res.json(body);
});

app.delete("/", (req, res) => {
  const { body } = req;
  return res.json({ id: body.id });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
