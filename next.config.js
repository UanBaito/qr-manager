/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    sassOptions: {
        additionalData: `@import "/styles/variables.scss";`
    }
}

if (
    process.env.LD_LIBRARY_PATH == null ||
    !process.env.LD_LIBRARY_PATH.includes(
        `${process.env.PWD}/node_modules/canvas/build/Release:`,
    )
) {
    process.env.LD_LIBRARY_PATH = `${process.env.PWD
        }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

module.exports = nextConfig

