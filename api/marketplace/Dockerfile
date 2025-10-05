# Etapa 1: Build da aplicação
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Dependências em cache antes do resto do projeto
RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests

# Etapa 2: Imagem leve para produção
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Reduz o tamanho da imagem final
COPY --from=builder /app/target/*.jar app.jar

# Expor a porta para garantir visibilidade na Render
EXPOSE 8080

# Start da aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
