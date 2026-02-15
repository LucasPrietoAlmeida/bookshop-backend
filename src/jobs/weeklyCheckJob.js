const cron = require('node-cron');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const { sendEmail } = require('../services/email.services');

const weeklyCheckJob = () => {
    cron.schedule('0 10 * * 1', async () => {
        console.log('Ejecutando cron job semanal...');

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const oldBooks = await Book.find({
                status: 'PUBLISHED',
                createdAt: { $lte: sevenDaysAgo },
                emailSent: { $ne: true }
            });

            for (const book of oldBooks) {
                const seller = await User.findById(book.ownerId);
                if (!seller) continue;

                await sendEmail({
                    to: seller.email,
                    subject: 'Sugerencia: baja el precio de tu libro',
                    text: `Tu libro "${book.title}" lleva más de 7 días publicado. Considera bajar su precio para aumentar las ventas.`
                });

                book.emailSent = true;
                await book.save();
            }


            console.log(`Cron job finalizado. Libros revisados: ${oldBooks.length}`);
        } catch (err) {
            console.error('Error en cron job semanal:', err);
        }
    });
};

module.exports = weeklyCheckJob;
