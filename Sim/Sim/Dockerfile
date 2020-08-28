FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY ./Sim/publish ./
RUN cd publish
ENTRYPOINT ["dotnet", "Sim.dll"]