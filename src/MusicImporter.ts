import { MusicDataProvider } from './MusicDataProvider';
import { AppDataSource } from './MusicDataProvider';
import { Track } from './entities/Track';         
import { Artist } from './entities/Artist';
import { Album } from './entities/Album';   
import path from 'path';

async function importMusic() {
    const connection = await createConnection();

    try {
        const musicDataProvider = new MusicDataProvider();
        const musicFolder = path.join(__dirname, '../../media/music');

        console.log('Scanning music folder...');
        const musicFiles = await musicDataProvider.scan(musicFolder);

        console.log(`Found ${musicFiles.length} music files. Importing to database...`);

        const trackRepository = getRepository(Track);
        const artistRepository = getRepository(Artist);
        const albumRepository = getRepository(Album);

        for (const file of musicFiles) {
            const { common, format } = file.metadata;

            // Find or create Artist
            let artist = await artistRepository.findOne({ where: { name: common.artist || 'Unknown Artist' } });
            if (!artist) {
                artist = artistRepository.create({ name: common.artist || 'Unknown Artist' });
                await artistRepository.save(artist);
            }

            // Find or create Album
            let album = await albumRepository.findOne({ 
                where: { 
                    title: common.album || 'Unknown Album',
                    artist: { id: artist.id }
                },
                relations: ['artist']
            });
            if (!album) {
                album = albumRepository.create({
                    title: common.album || 'Unknown Album',
                    year: common.year ? parseInt(common.year) : null,
                    artist: artist
                });
                await albumRepository.save(album);
            }

            // Create and save Track
            const track = trackRepository.create({
                path: file.path,
                title: common.title || path.basename(file.path),
                year: common.year ? parseInt(common.year) : null,
                genre: common.genre ? common.genre[0] : null,
                duration: format.duration || 0,
                artist: artist,
                album: album
            });

            await trackRepository.save(track);
        }

        console.log('Music import completed successfully!');
    } catch (error) {
        console.error('Error during music import:', error);
    } finally {
        await connection.close();
    }
}

importMusic().catch(console.error);