import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Create test user
  const hashedPassword = await hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  // Create test artist
  const artist = await prisma.artist.create({
    data: {
      name: 'Test Artist',
      bio: 'This is a test artist biography',
    },
  });

  // Create test album
  const album = await prisma.album.create({
    data: {
      title: 'Test Album',
      year: 2024,
      artistId: artist.id,
    },
  });

  // Create test tracks
  const tracks = await Promise.all([
    prisma.track.create({
      data: {
        title: 'Track 1',
        duration: 180, // 3 minutes
        albumId: album.id,
      },
    }),
    prisma.track.create({
      data: {
        title: 'Track 2',
        duration: 240, // 4 minutes
        albumId: album.id,
      },
    }),
  ]);

  // Create test playlist
  await prisma.playlist.create({
    data: {
      name: 'My Favorites',
      userId: user.id,
      tracks: {
        connect: tracks.map(track => ({ id: track.id })),
      },
    },
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 