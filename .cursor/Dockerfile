FROM node:22-bookworm-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends git curl ca-certificates unzip \
	&& rm -rf /var/lib/apt/lists/* \
	&& curl -fsSL https://bun.sh/install | bash \
	&& mv /root/.bun /opt/bun \
	&& ln -s /opt/bun/bin/bun /usr/local/bin/bun \
	&& usermod -l ubuntu node \
	&& groupmod -n ubuntu node \
	&& usermod -d /home/ubuntu -m ubuntu

USER ubuntu
