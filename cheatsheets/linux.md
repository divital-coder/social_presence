# Linux Cheatsheet

## Table of Contents

- [Ubuntu](#ubuntu)
- [Arch Linux](#arch-linux)

---

## Ubuntu

Set / manipulate screen vibrance:

```bash
nvidia-settings --assign [gpu:0]/DigitalVibrance=1023
```

---

## Arch Linux

### Python Virtual Environments (miniforge / mamba)

Notes on virtual environments in Arch:

- Anaconda is not ideal: painfully slow to install packages via conda.
- An alternative discovered while installing TensorFlow on Anaconda on Windows is miniforge.
- By default, virtual environments on Arch do not make sense because Python packages get installed system-wide from the AUR.
- There is no pip installation of Python on Arch (at least in this setup).
- Use the [miniforge repository](https://github.com/conda-forge/miniforge/#download) for Arch install. It comes with a base environment (current system-wide), plus `mamba` and `conda` preinstalled.
- Install packages via the conda-forge channel.

```bash
mamba env list
mamba activate <environment_name>
mamba install <package_name>
# or
pip install -r requirements.txt
```

CAUTION: activate your virtual environment first from mamba.

Reference: [Conda wiki on Arch Linux](https://wiki.archlinux.org/title/Conda)

### Brightness (ddcutil / Wayland backend, Hyprland)

```bash
sudo pacman -S ddcutil
sudo usermod -aG i2c $USER
# Reboot your system after this step
sudo chmod a+rw /dev/i2c-*  # Optional, temporary fix without reboot
ddcutil detect
ddcutil capabilities
ddcutil setvcp 10 30  # Set brightness to 30%
```

### Windows 11 VM (GPU passthrough)

Setting up a Windows 11 VM on an Arch Linux host. Ideally a dual-GPU setup for GPU passthrough to the guest OS (Windows 11).

Tutorials followed:

- https://youtu.be/OwFZW8x8SsY
- https://computingforgeeks.com/install-kvm-qemu-virt-manager-arch-manjar/
- https://youtu.be/woji50z1hF0
- https://youtu.be/7tqKBy9r9b4

Desktop like Chris Titus: https://youtu.be/wNL6eIoksd8
