const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");
const lessonRoutes = require("./lesson.routes");
const questionBankRoutes = require("./question-bank.routes");
const quizRoutes = require("./quiz.routes");
const quizResultRoutes = require("./quiz-result.routes");

function route(app) {
    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/courses", courseRoutes);
    app.use("/api/question-bank", questionBankRoutes);
    app.use("/api/lessons", lessonRoutes);
    app.use("/api/quizzes", quizRoutes);
    app.use("/api/quiz-results", quizResultRoutes);
}


module.exports = route;