// Middleware factory — takes a Zod schema, returns an Express middleware.
// the syntax is almost same for all the validators
const validator = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const firstError = result.error?.issues?.[0]?.message || "Validation error";
        return res.status(400).json({
            success: false,
            message: firstError,  
            errors: result.error.format(),          
        });
    }
    next();
};

export default validator;
