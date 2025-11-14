# You can use most Debian-based base images
FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Setup working directory
WORKDIR /home/user

# Install Next.js app
RUN npx --yes create-next-app@15.3.3 nextjs-app --yes

# Install shadcn
WORKDIR /home/user/nextjs-app
RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# Move Next.js files to /home/user and cleanup
RUN mv /home/user/nextjs-app/* /home/user/nextjs-app/.* /home/user/ 2>/dev/null || true && \
    rm -rf /home/user/nextjs-app

# Copy and setup compile script
WORKDIR /home/user
COPY compile_page.sh /home/user/compile_page.sh
RUN chmod +x /home/user/compile_page.sh

# Set default command
CMD ["/home/user/compile_page.sh"]