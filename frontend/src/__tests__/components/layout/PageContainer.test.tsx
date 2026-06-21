import { render, screen } from "@testing-library/react";
import PageContainer from "@/components/layout/PageContainer";

describe("PageContainer", () => {
  it("renders its children", () => {
    render(
      <PageContainer>
        <div>Page Content</div>
      </PageContainer>,
    );

    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <PageContainer>
        <h1>Heading</h1>
        <p>Description</p>
      </PageContainer>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Heading",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
