import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Route } from "@/routes/index";

const InvitationPage = Route.options.component;

describe("Invitation audio", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("plays the background video after starting and lets the visitor mute it", () => {
    if (!InvitationPage) {
      throw new Error("The invitation route component is missing.");
    }

    render(<InvitationPage />);

    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    expect(video?.getAttribute("src")).toContain("background-loop.mp4");
    expect(video).toHaveProperty("muted", true);
    expect(screen.getByAltText("Göksu'nun kurbağa kapüşonlu anime karakteri").getAttribute("src")).toContain(
      "goksu-avatar.png",
    );

    fireEvent.click(screen.getByRole("button", { name: "Hadi başlayalım" }));

    expect(video).toHaveProperty("muted", false);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "Arka plan sesini kapat" }));

    expect(video).toHaveProperty("muted", true);
  });
});
