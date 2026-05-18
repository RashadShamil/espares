import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Create Brands
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { name: 'Samsung' }, update: {}, create: { name: 'Samsung' } }),
    prisma.brand.upsert({ where: { name: 'LG' }, update: {}, create: { name: 'LG' } }),
    prisma.brand.upsert({ where: { name: 'Singer' }, update: {}, create: { name: 'Singer' } }),
    prisma.brand.upsert({ where: { name: 'Panasonic' }, update: {}, create: { name: 'Panasonic' } }),
    prisma.brand.upsert({ where: { name: 'Generic/Universal' }, update: {}, create: { name: 'Generic/Universal' } }),
  ])
  console.log('✅ Brands created')

  // 2. Create Categories & Subcategories
  
  // WASHING MACHINE
  const washingMachine = await prisma.category.upsert({
    where: { name: 'Washing Machine' },
    update: {},
    create: {
      name: 'Washing Machine',
      subCategories: {
        create: [
          { name: 'PCB' }, { name: 'Water Level Sensor' }, { name: 'Pulsators' },
          { name: 'Inlet Valve' }, { name: 'Drain Hose' }, { name: 'Shock Absorbers' },
          { name: 'Belt' }, { name: 'Clutch/Gearbox' }, { name: 'Drain Motors' },
          { name: 'Door Lock' }, { name: 'Spider Arm' }, { name: 'Capacitors' }
        ]
      }
    }
  })

  // AIR CONDITIONER
  const airConditioner = await prisma.category.upsert({
    where: { name: 'Air Conditioner' },
    update: {},
    create: {
      name: 'Air Conditioner',
      subCategories: {
        create: [
          { name: 'Remote' }, { name: 'IDU Motor' }, { name: 'ODU Motor' },
          { name: 'PCB' }, { name: 'Capacitors' }
        ]
      }
    }
  })

  // REFRIGERATOR
  const refrigerator = await prisma.category.upsert({
    where: { name: 'Refrigerator' },
    update: {},
    create: {
      name: 'Refrigerator',
      subCategories: {
        create: [
          { name: 'Motors' }, { name: 'PCB' }, { name: 'Thermostat' },
          { name: 'Overload/Relay' }, { name: 'Heating Condenser' },
          { name: 'Sensor/Bi-metal' }, { name: 'Timer' }
        ]
      }
    }
  })
  
  console.log('✅ Categories & Subcategories created')
  console.log('🎉 Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })