"""Prints the firewall commands that let ONLY Cloudflare reach the website ports (ports 80 and 443) of the origin server.

Why: if the server answers anyone who types its IP address, attackers skip Cloudflare's firewall and bot protection
(finding CLOUD-01 in the October 2026 penetration-test report).

This script only PRINTS commands. It changes nothing. Read them, then run them on the server (as root) yourself.

    python ops/cloudflare_firewall_commands.py            # UFW commands (Ubuntu / Debian)
    python ops/cloudflare_firewall_commands.py --iptables # iptables commands
    python ops/cloudflare_firewall_commands.py --list     # just the address ranges (for aaPanel / a cloud firewall)

BEFORE you run them:
  * Cloudflare must be in front of the site (the orange cloud "Proxied" on the DNS records), or the site will go offline.
  * Keep SSH open for your own IP:  ufw allow from <your office IP> to any port 22
  * Keep the aaPanel / hosting panel port (8888 by default) open ONLY for your office IP, never for everyone.
"""
import sys
import urllib.request

SOURCES = {"v4": "https://www.cloudflare.com/ips-v4", "v6": "https://www.cloudflare.com/ips-v6"}
PORTS = (80, 443)


def ranges() -> list[str]:
    found: list[str] = []
    for url in SOURCES.values():
        request = urllib.request.Request(url, headers={"User-Agent": "jhs-ops-script/1.0"})   # Cloudflare refuses the default Python agent
        with urllib.request.urlopen(request, timeout=20) as resp:   # the official, public Cloudflare list
            found += [line.strip() for line in resp.read().decode().splitlines() if line.strip()]
    return found


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "--ufw"
    cidrs = ranges()
    if mode == "--list":
        print("\n".join(cidrs))
        return
    print("# Cloudflare-only web access. Review, then run as root. (Fetched live from cloudflare.com/ips)")
    if mode == "--iptables":
        for cidr in cidrs:
            tool = "ip6tables" if ":" in cidr else "iptables"
            for port in PORTS:
                print(f"{tool} -I INPUT -p tcp -s {cidr} --dport {port} -j ACCEPT")
        for port in PORTS:
            print(f"iptables -A INPUT -p tcp --dport {port} -j DROP")
            print(f"ip6tables -A INPUT -p tcp --dport {port} -j DROP")
        return
    for cidr in cidrs:
        for port in PORTS:
            print(f"ufw allow from {cidr} to any port {port} proto tcp")
    for port in PORTS:   # remove any older rule that lets everyone in
        print(f"ufw delete allow {port}/tcp   # only if such a rule exists")
    print("ufw status numbered")


if __name__ == "__main__":
    main()
