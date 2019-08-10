# Windows

## Command
The following line works relatively well, assuming ghostscript is available:
`gswin64.exe -sDEVICE=mswinpr2 -dBATCH -dNOPAUSE -sOutputFile="%printer%Printy" D:\pdf.pdf`
(replace binary with appropriate, non stupidly-named version)

## Missing
- A window will appear (briefly) for Ghostscript, and depending on the printer settings, a window might appear for the printer itself. If it happens, configure the WM to make them background only or something.

# Linux

## Command
We could use either `lp` or `ghostscript` like the above.
Because I'm a lazy madman I'll probably go the ghostscript way if it does work.