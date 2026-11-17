@echo off
rem Atualiza as velas (Yahoo Finance) e recalcula as previsoes Kronos em data\ohlc e data\kronos.
rem Depois e preciso grava-las nas colecoes "ohlc" e "kronos" do artefacto Radar Macro.
cd /d "%~dp0.."
node tools\fetch-ohlc.js data && .venv-kronos\Scripts\python.exe -W ignore tools\kronos-forecast.py data %*
